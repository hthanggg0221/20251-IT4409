document.addEventListener('DOMContentLoaded', function () {
    // Nút bấm cho mobile
    const menuBtn = document.getElementById('menu-toggle-btn');
    const nav = document.getElementById('main-nav');

    if (menuBtn && nav) {
        menuBtn.addEventListener('click', function () {
            nav.classList.toggle('is-open');
        });
    }

    // Logic ẩn/hiện form "Thêm sản phẩm"
    const addProductBtn = document.getElementById('addProductBtn');
    const addProductFormContainer = document.getElementById('addProductFormContainer');
    const cancelBtn = document.getElementById('cancelBtn');

    if (addProductBtn && addProductFormContainer) {
        addProductBtn.addEventListener('click', function () {
            addProductFormContainer.classList.toggle('hidden');
        });
    }

    if (cancelBtn && addProductFormContainer) {
        cancelBtn.addEventListener('click', function () {
            addProductFormContainer.classList.add('hidden');
        });
    }

    // Logic Tìm/Lọc sản phẩm
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');

    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        const allProducts = document.querySelectorAll('#product-list .product-item');

        allProducts.forEach(function (product) {
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

    const addProductForm = document.getElementById('addProductForm');
    const errorMsg = document.getElementById('errorMsg');
    const productList = document.getElementById('product-list');

    let products = [];
    const LOCAL_STORAGE_KEY = 'products';

    function saveProductsToStorage() {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
        } catch (e) {
            console.error("Không thể lưu vào localStorage:", e);
        }
    }

    function createProductElement(product) {
        const newItem = document.createElement('article');
        newItem.className = 'product-item';

        const formattedPrice = Number(product.price).toLocaleString('vi-VN');
        const desc = product.desc || "";

        newItem.innerHTML = `
            <img src="https://placehold.co/300x200?text=${encodeURIComponent(product.name)}" alt="${product.name}" style="width:100%;">
            <h3>${product.name}</h3>
            <p>${desc}</p>
            <p class="price">Giá: ${formattedPrice} VNĐ</p>
        `;
        return newItem;
    }

    function renderAllProducts() {
        productList.innerHTML = '';

        for (const product of products) {
            const productElement = createProductElement(product);
            productList.appendChild(productElement);
        }
    }

    function initializeDefaultProducts() {
        products = [
            { name: "Bánh mì thịt nướng", price: 25000, desc: "Bánh mì truyền thống với thịt nướng thơm lừng, pate, dưa leo và rau thơm." },
            { name: "Bánh mì ốp la", price: 20000, desc: "Hai trứng ốp la lòng đào, ăn kèm xì dầu, tương ớt và bánh mì nóng." },
            { name: "Bánh mì chảo", price: 35000, desc: "Một phần ăn đầy đặn với pate, xúc xích, trứng và xíu mại trên chảo gang." }
        ];
        saveProductsToStorage();
    }

    function loadProductsFromStorage() {
        try {
            const storedProducts = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (storedProducts) {
                const parsedProducts = JSON.parse(storedProducts);
                if (Array.isArray(parsedProducts)) {
                    products = parsedProducts;
                } else {
                    initializeDefaultProducts();
                }
            } else {
                initializeDefaultProducts();
            }
        } catch (e) {
            console.error("Không thể parse localStorage, tạo lại dữ liệu mẫu:", e);
            initializeDefaultProducts();
        }

        renderAllProducts();
    }

    if (addProductForm && errorMsg && productList && addProductFormContainer) {

        addProductForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const name = document.getElementById('newName').value.trim();
            const price = document.getElementById('newPrice').value.trim();
            const desc = document.getElementById('newDesc').value.trim();

            if (!name || !price || isNaN(price) || Number(price) <= 0) {
                errorMsg.textContent = "Vui lòng nhập tên và giá hợp lệ (giá phải là số > 0).";
                return;
            }

            errorMsg.textContent = "";

            const newProduct = {
                name: name,
                price: Number(price),
                desc: desc
            };

            products.unshift(newProduct);
            saveProductsToStorage();
            renderAllProducts();

            addProductForm.reset();
            addProductFormContainer.classList.add('hidden');
        });
    }
    loadProductsFromStorage();
});