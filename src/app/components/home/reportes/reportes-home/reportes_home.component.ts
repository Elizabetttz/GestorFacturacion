import { Component, signal, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeatherModule } from 'angular-feather';
import { FacturacionRecibidasService } from '../../../../services/facturacion-recibidas';
import { Facturas_recibidas } from '../../../../models/facturas_recibidas.model';
import { ChangeDetectorRef } from '@angular/core';
@Component({
    selector: 'app-reportes-home',
    standalone: true,
    imports: [CommonModule, FormsModule, FeatherModule],
    templateUrl: './reportes_home.component.html',
    styleUrls: ['./reportes_home.component.scss']
})
export class ReportesHomeComponent implements OnInit {
    facturas = signal<Facturas_recibidas[]>([]);
    filteredFacturas: Facturas_recibidas[] = [];
    paginatedFacturas: Facturas_recibidas[] = [];
    
    searchTerm: string = '';
    currentPage: number = 1;
    itemsPerPage: number = 10;
    totalPages: number = 1;
    
    sortColumn: string = '';
    sortDirection: 'asc' | 'desc' = 'asc';
    
    isLoading: boolean = false;
    cargando: boolean = false;
    procesoCompletado: boolean = false;
    mensaje: string = '';
    error: boolean = false;


    constructor(
        private facturacionService: FacturacionRecibidasService,
        private zone: NgZone,
        private cdr: ChangeDetectorRef
    ) {}
    
    ngOnInit() {
        this.loadFacturas();
    }

    loadFacturas() {
        this.isLoading = true;
        this.facturacionService.getAllFacturas().subscribe({
            next: (data) => {
                this.facturas.set(data);
                this.filteredFacturas = data;
                this.updatePagination();
                this.isLoading = false;
                console.log('✅ Facturas cargadas:', data.length);
            },
            error: (error) => {
                console.error('❌ Error cargando facturas:', error);
                this.isLoading = false;
                alert('Error al cargar las facturas recibidas');
            }
        });
    }

    filterFacturas() {
        const term = this.searchTerm.toLowerCase().trim();
        
        if (!term) {
            this.filteredFacturas = this.facturas();
        } else {
            this.filteredFacturas = this.facturas().filter(factura =>
                factura.numero_factura?.toLowerCase().includes(term) ||
                factura.comercializadora_nit?.toLowerCase().includes(term) ||
                factura.comercializadora_nombre?.toLowerCase().includes(term) ||
                factura.descripcion?.toLowerCase().includes(term)
            );
        }
        
        this.currentPage = 1;
        this.updatePagination();
    }

    sortBy(column: string) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }

        this.filteredFacturas.sort((a, b) => {
            let valueA = a[column as keyof Facturas_recibidas];
            let valueB = b[column as keyof Facturas_recibidas];

            // Manejar valores nulos o undefined
            if (valueA == null) return 1;
            if (valueB == null) return -1;

            // Comparación de fechas
            if (column === 'fecha_emision') {
                const dateA = new Date(valueA).getTime();
                const dateB = new Date(valueB).getTime();
                return this.sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
            }

            if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
            if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        this.updatePagination();
    }

    updatePagination() {
        this.totalPages = Math.ceil(this.filteredFacturas.length / this.itemsPerPage);
        if (this.totalPages === 0) this.totalPages = 1;
        
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        this.paginatedFacturas = this.filteredFacturas.slice(startIndex, endIndex);
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.updatePagination();
        }
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.updatePagination();
        }
    }

    downloadPDF(ruta: string) {
        if (!ruta) {
            alert('No hay ruta de PDF disponible');
            return;
        }

        // Construir URL completa del PDF
        const pdfUrl = `http://localhost:3000/facturas/${ruta.split('\\').pop()}`;
        
        // Abrir en nueva pestaña
        window.open(pdfUrl, '_blank');
        
        // Alternativa: Descargar directamente
        // const link = document.createElement('a');
        // link.href = pdfUrl;
        // link.download = ruta.split('\\').pop() || 'factura.pdf';
        // link.target = '_blank';
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);
    }

    viewFactura(factura: Facturas_recibidas) {
        console.log('👁️ Ver factura:', factura);
        // TODO: Implementar modal o navegación a detalle
        // Ejemplo: this.router.navigate(['/facturas', factura.id]);
    }

    editFactura(factura: Facturas_recibidas) {
        console.log('✏️ Editar factura:', factura);
        // TODO: Implementar modal de edición o navegación
        // Ejemplo: this.router.navigate(['/facturas/editar', factura.id]);
    }

    deleteFactura(factura: Facturas_recibidas) {
        const confirmMessage = `¿Está seguro de eliminar la factura:\n\nN° ${factura.numero_factura}\nComercializadora: ${factura.comercializadora_nombre}?\n\nEsta acción no se puede deshacer.`;
        
        if (confirm(confirmMessage)) {
            this.facturacionService.deleteFactura(factura.id).subscribe({
                next: () => {
                    console.log('✅ Factura eliminada:', factura.id);
                    alert('Factura eliminada exitosamente');
                    // Recargar las facturas
                    this.loadFacturas();
                },
                error: (error) => {
                    console.error('❌ Error eliminando factura:', error);
                    alert('Error al eliminar la factura');
                }
            });
        }
    }

    actualizarFacturas() {

        this.cargando = true;
        this.procesoCompletado = false;
        console.log('Iniciando actualizacion de facturas...');

        this.facturacionService.atualizarFacturas().subscribe({
            next: (resp) => {
                this.zone.run(()=>{
                this.cargando = false;
                this.procesoCompletado = true;
                this.mensaje = resp; 
                });
                this.cdr.detectChanges();
            },

            error: (err) =>{
                this.zone.run(()=>{
                console.error('Error en el proceso:', err);
                this.cargando = false;
                this.error = true;
                this.mensaje = "Ocurrio un error al actualizar."
           
                this.cdr.detectChanges();
            });    
            }
        });
    }

    cerrarModal() {
    this.cargando = false;
    this.procesoCompletado = false;
    this.error = false;

    this.loadFacturas();
    }

}