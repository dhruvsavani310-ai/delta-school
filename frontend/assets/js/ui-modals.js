class UIModals {
    /**
     * Shows a confirmation modal
     * @returns {Promise<boolean>} Resolves to true if confirmed, false otherwise
     */
    static async confirm(title, message, confirmText = 'Confirm', confirmColor = 'danger') {
        return new Promise((resolve) => {
            const id = 'modal-' + Date.now();
            const html = `
            <div class="modal fade" id="${id}" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content border-0 shadow">
                        <div class="modal-header border-0 pb-0">
                            <h5 class="modal-title fw-bold">${title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body text-center py-4">
                            <p class="fs-5 mb-0">${message}</p>
                        </div>
                        <div class="modal-footer border-0 pt-0 d-flex justify-content-center">
                            <button type="button" class="btn btn-light px-4" data-bs-dismiss="modal" id="btn-cancel-${id}">Cancel</button>
                            <button type="button" class="btn btn-${confirmColor} px-4" id="btn-confirm-${id}">${confirmText}</button>
                        </div>
                    </div>
                </div>
            </div>`;
            document.body.insertAdjacentHTML('beforeend', html);
            const modalEl = document.getElementById(id);
            const modal = new bootstrap.Modal(modalEl);
            
            document.getElementById(`btn-confirm-${id}`).addEventListener('click', () => {
                modal.hide();
                resolve(true);
            });
            document.getElementById(`btn-cancel-${id}`).addEventListener('click', () => {
                modal.hide();
                resolve(false);
            });
            modalEl.addEventListener('hidden.bs.modal', () => {
                modalEl.remove();
                resolve(false); // In case they clicked the X button
            });
            modal.show();
        });
    }

    /**
     * Shows an alert modal (success/error/info)
     */
    static async alert(title, message, type = 'info') {
        return new Promise((resolve) => {
            const id = 'modal-' + Date.now();
            let iconHtml = '';
            let btnColor = 'primary';
            
            if (type === 'success') {
                iconHtml = '<i class="fa-solid fa-circle-check text-success mb-3" style="font-size: 3rem;"></i>';
                btnColor = 'success';
            } else if (type === 'danger' || type === 'error') {
                iconHtml = '<i class="fa-solid fa-circle-xmark text-danger mb-3" style="font-size: 3rem;"></i>';
                btnColor = 'danger';
            } else if (type === 'warning') {
                iconHtml = '<i class="fa-solid fa-triangle-exclamation text-warning mb-3" style="font-size: 3rem;"></i>';
                btnColor = 'warning';
            }

            const html = `
            <div class="modal fade" id="${id}" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered modal-sm">
                    <div class="modal-content border-0 shadow">
                        <div class="modal-header border-0 pb-0">
                            <h5 class="modal-title fw-bold">${title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body text-center py-4">
                            ${iconHtml}
                            <p class="fs-6 mb-0">${message}</p>
                        </div>
                        <div class="modal-footer border-0 pt-0 d-flex justify-content-center">
                            <button type="button" class="btn btn-${btnColor} px-4" data-bs-dismiss="modal">OK</button>
                        </div>
                    </div>
                </div>
            </div>`;
            document.body.insertAdjacentHTML('beforeend', html);
            const modalEl = document.getElementById(id);
            const modal = new bootstrap.Modal(modalEl);
            
            modalEl.addEventListener('hidden.bs.modal', () => {
                modalEl.remove();
                resolve();
            });
            modal.show();
        });
    }

    /**
     * Shows a prompt modal
     * @returns {Promise<string|null>} Resolves to string input, or null if cancelled
     */
    static async prompt(title, placeholder = '') {
        return new Promise((resolve) => {
            const id = 'modal-' + Date.now();
            const html = `
            <div class="modal fade" id="${id}" tabindex="-1" data-bs-backdrop="static">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content border-0 shadow">
                        <div class="modal-header border-0 pb-0">
                            <h5 class="modal-title fw-bold">${title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body py-4">
                            <input type="text" class="form-control" id="input-${id}" placeholder="${placeholder}">
                        </div>
                        <div class="modal-footer border-0 pt-0 d-flex justify-content-end">
                            <button type="button" class="btn btn-light px-4" data-bs-dismiss="modal" id="btn-cancel-${id}">Cancel</button>
                            <button type="button" class="btn btn-primary px-4" id="btn-confirm-${id}">Submit</button>
                        </div>
                    </div>
                </div>
            </div>`;
            document.body.insertAdjacentHTML('beforeend', html);
            const modalEl = document.getElementById(id);
            const modal = new bootstrap.Modal(modalEl);
            const inputEl = document.getElementById(`input-${id}`);
            
            document.getElementById(`btn-confirm-${id}`).addEventListener('click', () => {
                const val = inputEl.value;
                modal.hide();
                resolve(val);
            });
            document.getElementById(`btn-cancel-${id}`).addEventListener('click', () => {
                modal.hide();
                resolve(null);
            });
            inputEl.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    document.getElementById(`btn-confirm-${id}`).click();
                }
            });
            modalEl.addEventListener('shown.bs.modal', () => {
                inputEl.focus();
            });
            modalEl.addEventListener('hidden.bs.modal', () => {
                modalEl.remove();
                resolve(null); // In case of X button
            });
            modal.show();
        });
    }
}
