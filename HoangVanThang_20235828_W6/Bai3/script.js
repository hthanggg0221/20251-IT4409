document.addEventListener('DOMContentLoaded', function() {
    // Nút bấm cho mobile
    const menuBtn = document.getElementById('menu-toggle-btn');
    const nav = document.getElementById('main-nav');

    if (menuBtn && nav) {
        menuBtn.addEventListener('click', function() {
            nav.classList.toggle('is-open');
        });
    }

    // Logic ẩn/hiện form "Thêm sản phẩm"
    const addProductBtn = document.getElementById('addProductBtn');
    const addProductFormContainer = document.getElementById('addProductFormContainer');
    const cancelBtn = document.getElementById('cancelBtn');

    if (addProductBtn && addProductFormContainer) {
        addProductBtn.addEventListener('click', function() {
            addProductFormContainer.classList.toggle('hidden');
        });
    }

    if (cancelBtn && addProductFormContainer) {
        cancelBtn.addEventListener('click', function() {
            addProductFormContainer.classList.add('hidden');
        });
    }

    // Logic Tìm/Lọc sản phẩm
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');

    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        const allProducts = document.querySelectorAll('#product-list .product-item');

        allProducts.forEach(function(product) {
            const productNameElement = product.querySelector('h3');
            
            if (productNameElement) {
                const productName = productNameElement.textContent.toLowerCase();
                if (productName.includes(searchTerm)) {
                    product.style.display = 'flex'; 
                } else {
                    product.style.display = 'none';
                }
            }
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', filterProducts);
    }

    if (searchInput) {
        searchInput.addEventListener('keyup', filterProducts);
    }
});