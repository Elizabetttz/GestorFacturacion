import { Component, signal, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeatherModule } from 'angular-feather';
import { OrdenesCompraService } from '../../../../services/ordenes-compra';
import { Ordenes_Compra } from '../../../../models/ordenes_compra';
import { ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'app-ordenes',
    templateUrl: './ordenes.component.html',
    styleUrls: ['./ordenes.component.scss'],
    imports: [CommonModule, FormsModule, FeatherModule]
})
export class OrdenesComponent implements OnInit{ 
     ordenes = signal<Ordenes_Compra[]>([]);
    filteredOrdenes: Ordenes_Compra[] = [];
    paginatedOrdenes: Ordenes_Compra[] = [];
    
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
        private ordenesService: OrdenesCompraService,
        private zone: NgZone,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.loadOrdenes();
    }

    loadOrdenes() {
        this.isLoading = true;
        this.ordenesService.getAllFacturas().subscribe({
            next: (data) => {
                this.ordenes.set(data);
                this.filteredOrdenes = data;
                this.updatePagination();
                this.isLoading = false;
                console.log('✅ Órdenes cargadas:', data.length);
            },
            error: (error) => {
                console.error('❌ Error cargando órdenes:', error);
                this.isLoading = false;
                alert('Error al cargar las órdenes de compra');
            }
        });
    }

    filterOrdenes() {
        const term = this.searchTerm.toLowerCase().trim();
        
        if (!term) {
            this.filteredOrdenes = this.ordenes();
        } else {
            this.filteredOrdenes = this.ordenes().filter(orden =>
                orden.comprador_nit?.toLowerCase().includes(term) ||
                orden.comprador_nombre?.toLowerCase().includes(term) ||
                orden.descripcion?.toLowerCase().includes(term)
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

        this.filteredOrdenes.sort((a, b) => {
            let valueA = a[column as keyof Ordenes_Compra];
            let valueB = b[column as keyof Ordenes_Compra];

            // Manejar valores nulos o undefined
            if (valueA == null) return 1;
            if (valueB == null) return -1;

            if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
            if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        this.updatePagination();
    }

    updatePagination() {
        this.totalPages = Math.ceil(this.filteredOrdenes.length / this.itemsPerPage);
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        this.paginatedOrdenes = this.filteredOrdenes.slice(startIndex, endIndex);
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
        // Asumiendo que tu backend sirve los PDFs en http://localhost:3000/ordenes/
        const pdfUrl = `http://localhost:3000/ordenes/${ruta.split('\\').pop()}`;
        
        // Abrir en nueva pestaña
        window.open(pdfUrl, '_blank');
        
        // Alternativa: Descargar directamente
        // const link = document.createElement('a');
        // link.href = pdfUrl;
        // link.download = ruta.split('\\').pop() || 'orden.pdf';
        // link.target = '_blank';
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);
    }

    deleteOrden(orden: Ordenes_Compra) {
        const confirmMessage = `¿Está seguro de eliminar la orden de compra del comprador:\n\n${orden.comprador_nombre}?\n\nEsta acción no se puede deshacer.`;
        
        if (confirm(confirmMessage)) {
            this.ordenesService.deleteFactura(orden.id).subscribe({
                next: () => {
                    console.log('✅ Orden eliminada:', orden.id);
                    alert('Orden de compra eliminada exitosamente');
                    // Recargar las órdenes
                    this.loadOrdenes();
                },
                error: (error) => {
                    console.error('❌ Error eliminando orden:', error);
                    alert('Error al eliminar la orden de compra');
                }
            });
        }
    }

    actualizarOrdenes() {
        this.cargando = true;
        this.procesoCompletado = false;
        console.log('Iniciando actualizacion de ordenes de compra...');
        
        this.ordenesService.actualizarOrdenes().subscribe({
            next:(resp) =>{
                this.zone.run(()=>{
                    this.cargando = false;
                    this.procesoCompletado = true;
                    this.mensaje = resp;
                });
                this.cdr.detectChanges();
            },
            
            error: (err) => {
                this.zone.run(()=>{
                    console.error('Error en el proceso:', err);
                    this.cargando = false;
                    this.error = true;
                    this.mensaje = "Ocurrio un error al actualizar las ordenes.";
                });
                this.cdr.detectChanges();
            }
        });
    }

    cerrarModal() {
    this.cargando = false;
    this.procesoCompletado = false;
    this.error = false;

    this.loadOrdenes();
    }
}