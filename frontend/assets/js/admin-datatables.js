/**
 * Admin DataTables Helper
 * Centralized logic for initializing and customizing DataTables across all admin pages.
 */

// Global DataTable Instance Reference
let currentDataTable = null;

/**
 * Initialize a premium DataTable instance.
 * @param {string} tableId - The ID of the table element (e.g., '#admissionsTableEl')
 * @param {Object} options - Configuration options (searchPlaceholder, filtersHtml, customFilterFn)
 */
function initAdminDataTable(tableId, options = {}) {
    // Destroy existing instance if any
    if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().destroy();
    }

    const {
        searchPlaceholder = "Search records...",
        filtersHtml = "",
        customFilterFn = null
    } = options;

    // Register custom filter function if provided
    if (customFilterFn) {
        // Clear previous custom filters
        $.fn.dataTable.ext.search = [];
        $.fn.dataTable.ext.search.push(customFilterFn);
    } else {
        $.fn.dataTable.ext.search = [];
    }

    // Override DataTables Bootstrap 5 defaults to prevent ugly btn-group and btn-secondary dark boxes
    if ($.fn.dataTable.Buttons) {
        $.fn.dataTable.Buttons.defaults.dom.container.className = 'dt-buttons d-flex gap-2 flex-wrap';
        $.fn.dataTable.Buttons.defaults.dom.button.className = 'btn btn-sm';
    }

    // Initialize DataTable
    currentDataTable = $(tableId).DataTable({
        // DOM positioning:
        // Top wrapper (custom container)
        // t = Table
        // Bottom wrapper (info, length, pagination)
        dom: "<'dt-toolbar-container'<'dt-search-wrapper'><'dt-actions-wrapper'>>" +
             "<'table-responsive'tr>" +
             "<'dt-bottom-controls'<'d-flex align-items-center'i>>",
        
        // Settings
        paging: false,
        order: [], // Let the server/HTML decide initial order, or leave empty
        autoWidth: false,
        
        // Language & Empty State
        language: {
            emptyTable: `
                <div class="py-5">
                    <i class="fa-solid fa-file-circle-xmark empty-state-icon"></i>
                    <h5 class="fw-bold">No Records Found</h5>
                    <p class="text-muted mb-0">Try changing your search or filters.</p>
                </div>
            `,
            zeroRecords: `
                <div class="py-5">
                    <i class="fa-solid fa-file-circle-xmark empty-state-icon"></i>
                    <h5 class="fw-bold">No Records Found</h5>
                    <p class="text-muted mb-0">Try changing your search or filters.</p>
                </div>
            `,
            info: "Showing _START_ \u2013 _END_ of _TOTAL_ Records",
            infoEmpty: "Showing 0 Records",
            lengthMenu: "_MENU_ per page",
            search: "" // We build our own search box
        },
        
        // Buttons for Export
        buttons: [
            {
                text: '<i class="fa-solid fa-rotate-right"></i> Refresh',
                className: 'btn btn-outline-secondary',
                action: function (e, dt, node, config) {
                    if (typeof window.refreshTableData === 'function') {
                        window.refreshTableData();
                    }
                }
            },
            {
                extend: 'csv',
                text: '<i class="fa-solid fa-file-csv"></i> CSV',
                className: 'btn btn-outline-primary',
                exportOptions: { columns: ':not(:last-child)' } // Exclude action column
            },
            {
                extend: 'excel',
                text: '<i class="fa-solid fa-file-excel"></i> Excel',
                className: 'btn btn-outline-success',
                exportOptions: { columns: ':not(:last-child)' }
            },
            {
                extend: 'print',
                text: '<i class="fa-solid fa-print"></i> Print',
                className: 'btn btn-outline-dark',
                exportOptions: { columns: ':not(:last-child)' }
            }
        ],

        // Initialization Callback
        initComplete: function(settings, json) {
            const dtApi = this.api();
            
            // 1. Inject Custom Search Box
            const searchHtml = `
                <div class="dt-search-box">
                    <i class="fa-solid fa-search"></i>
                    <input type="text" id="customDtSearch" placeholder="${searchPlaceholder}" aria-label="Search">
                </div>
            `;
            $('.dt-search-wrapper').html(searchHtml);
            
            // Bind custom search input to DataTables search API
            $('#customDtSearch').on('keyup change clear', function() {
                dtApi.search(this.value).draw();
            });

            // 2. Inject Custom Filters and Buttons
            const actionsHtml = `
                <div class="dt-filters">
                    ${filtersHtml}
                    <button type="button" class="btn btn-sm btn-light border" id="resetDtFilters" title="Reset Filters">
                        <i class="fa-solid fa-filter-circle-xmark"></i>
                    </button>
                    <div class="dt-buttons-container ms-2 d-inline-block"></div>
                </div>
            `;
            $('.dt-actions-wrapper').html(actionsHtml);

            // Move the export buttons into our container
            dtApi.buttons().container().appendTo('.dt-buttons-container');
            
            // Bind Reset Filters Button
            $('#resetDtFilters').on('click', function() {
                // Clear custom search box
                $('#customDtSearch').val('');
                dtApi.search('');
                
                // Reset all select/input filters within .dt-filters
                $('.dt-filters select, .dt-filters input[type="date"]').val('');
                
                // Redraw table
                dtApi.draw();
            });
            
            // 3. Bind change events to dynamic filters (assuming they have class .dt-custom-filter)
            $('.dt-filters select, .dt-filters input').on('change', function() {
                dtApi.draw(); // This triggers the customFilterFn automatically
            });
        }
    });
}
