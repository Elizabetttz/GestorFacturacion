import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { FacturacionService } from '../../../services/facturacion.Service'; // Ajusta la ruta según tu proyecto
import { Factura } from '../../../models/factura.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeatherModule } from "angular-feather";


@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.scss'],
  imports: [CommonModule, FormsModule, FeatherModule]
})

export class FacturacionComponent implements OnInit, OnDestroy {

  facturas = signal<Factura[]>([]);
  filteredFacturas: Factura[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 50;
  totalPages: number = 1;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  private facturSubscription: Subscription | undefined = undefined;

  constructor(private facturService: FacturacionService) {}

  ngOnInit(): void {
    this.loadFacturas();
  }

  loadFacturas() {
  this.facturSubscription = this.facturService.getAllFacturas().subscribe({
    next: (data: Factura[]) => {
      console.log('Datos del backend:', data);

      const facturasList = data.map((factura) => {
        //Limpiamos y redondeo del saldo
        const saldoLimpio = Math.round(
          (parseFloat((factura.saldo || '0').toString().replace(/[^0-9.-]+/g, '')) || 0) * 100
        ) / 100;

        return {
          ...factura,
          saldo: saldoLimpio,
          fechaUI: new Date(factura.fecha).toLocaleDateString('es-CO'),
        };
      });

      this.facturas.set(facturasList as Factura[]);
      this.filteredFacturas = facturasList as Factura[];
      this.calculateTotalPages();
    },
    error: (err) => {
      console.error('❌ Error al cargar las facturas', err);
    },
  });
}



  filterFacturas(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredFacturas = this.facturas();
    } else {
      this.filteredFacturas = this.facturas().filter(f => 
        f.numero_factura?.toLowerCase().includes(term) ||
        f.nit?.toLowerCase().includes(term) ||
        f.tercero?.toLowerCase().includes(term)
      );
    }
    this.currentPage = 1; // Resetear a la primera página
    this.calculateTotalPages();
  }

  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredFacturas = [...this.filteredFacturas].sort((a, b) => {
      const aVal = (a as any)[column];
      const bVal = (b as any)[column];
      
      // Manejo de valores nulos
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      
      // Comparación de fechas
      if (column === 'fecha' || column === 'fecha_pago') {
        const dateA = new Date(aVal).getTime();
        const dateB = new Date(bVal).getTime();
        return this.sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }
      
      // Comparación numérica
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return this.sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      // Comparación de strings
      const comparison = String(aVal).localeCompare(String(bVal), 'es-CO');
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  getStatusClass(status: string): string {
    const statusLower = status?.toLowerCase() || 'pendiente';
    if (statusLower.includes('aprobado') || statusLower.includes('pagado')) {
      return 'status-aprobado';
    }
    if (statusLower.includes('rechazado') || statusLower.includes('cancelado')) {
      return 'status-rechazado';
    }
    return 'status-pendiente';
  }

  viewFactura(factura: Factura): void {
    console.log('👁️ Ver factura:', factura);
    // TODO: Implementa modal o navegación a detalle
    // Ejemplo: this.router.navigate(['/facturas', factura.id]);
  }

  editFactura(factura: Factura): void {
    console.log('✏️ Editar factura:', factura);
    // TODO: Implementa modal de edición o navegación
    // Ejemplo: this.router.navigate(['/facturas/editar', factura.id]);
  }

  deleteFactura(factura: Factura): void {
    const confirmacion = confirm(
      `¿Estás seguro de eliminar la factura ${factura.numero_factura}?\n\nEsta acción no se puede deshacer.`
    );

     
    if (confirmacion) {
      this.facturService.deleteFactura(factura.id).subscribe({
        next: (res) => {
          console.log('✅ Factura eliminada');
          this.loadFacturas(); // Recargar lista
          // TODO: Mostrar notificación de éxito
        },
        error: (err) => {
          console.error('❌ Error al eliminar factura:', err);
          // TODO: Mostrar notificación de error
        }
      });
    }
  }

  exportToExcel(): void {
    console.log('📥 Exportando a Excel...');
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredFacturas.length / this.itemsPerPage);
    if (this.totalPages === 0) this.totalPages = 1;
  }

  get paginatedFacturas(): Factura[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredFacturas.slice(start, end);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  ngOnDestroy(): void {
    this.facturSubscription?.unsubscribe();
  }
}