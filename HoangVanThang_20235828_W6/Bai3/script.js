document.addEventListener('DOMContentLoaded', function () { // Chờ cho tài liệu HTML được tải và phân tích xong
    // Nút bấm cho mobile
    const menuBtn = document.getElementById('menu-toggle-btn');
    const nav = document.getElementById('main-nav');

    if (menuBtn && nav) { // "Null check": Luôn kiểm tra xem các phần tử có tồn tại không trước khi thêm sự kiện
        menuBtn.addEventListener('click', function () {
            nav.classList.toggle('is-open');
        });
    }

    // Logic ẩn/hiện form "Thêm sản phẩm"
    const addProductBtn = document.getElementById('addProductBtn');
    const addProductFormContainer = document.getElementById('addProductFormContainer');
    const cancelBtn = document.getElementById('cancelBtn');

    // Hàm đóng form
    function closeAddForm() {
        addProductFormContainer.style.maxHeight = "0px";
    }

    // Hàm mở form
    function openAddForm() {
        addProductFormContainer.style.maxHeight = addProductFormContainer.scrollHeight + "px";
    }

    if (addProductBtn && addProductFormContainer) { // Gắn sự kiện bật/tắt cho nút "Thêm sản phẩm"
        addProductBtn.addEventListener('click', function () {
            // Kiểm tra xem form có đang mở không (maxHeight khác 0)
            if (addProductFormContainer.style.maxHeight && addProductFormContainer.style.maxHeight !== "0px") {
                closeAddForm();
            } else {
                openAddForm();
            }
        });
    }

    // Nút hủy luôn luôn đóng form
    if (cancelBtn && addProductFormContainer) {
        cancelBtn.addEventListener('click', function () {
            closeAddForm();
        });
    }

    // Logic Tìm/Lọc sản phẩm
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');

    const productList = document.getElementById('product-list');
    const addProductForm = document.getElementById('addProductForm');
    const errorMsg = document.getElementById('errorMsg');

    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    const sortPriceAscBtn = document.getElementById('sortPriceAsc');
    const sortPriceDescBtn = document.getElementById('sortPriceDesc');

    let allProducts = [];
    const LOCAL_STORAGE_KEY = 'products';

    // Hàm lưu trạng thái 'allProducts' vào localStorage
    function saveProductsToStorage() {
        try {
            // JSON.stringify: Chuyển mảng [object] thành một chuỗi JSON
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allProducts));
        } catch (e) {
            console.error("Không thể lưu vào localStorage:", e);
        }
    }

    function createProductElement(product) {
        const newItem = document.createElement('article');
        newItem.className = 'product-item';
        newItem.setAttribute('data-id', product.id);

        // toLocaleString('vi-VN'): Tự động format số (vd: 20000 -> "20.000")
        const formattedPrice = Number(product.price).toLocaleString('vi-VN');
        const desc = product.desc || "";

        newItem.innerHTML = `
            <img src="https://placehold.co/300x200?text=${encodeURIComponent(product.name)}" alt="${product.name}" style.width="100%;">
            <h3>${product.name}</h3>
            <p>${desc}</p>
            <p class="price">Giá: ${formattedPrice} VNĐ</p>
            <button class="delete-btn">Xóa</button> 
        `;
        return newItem;
    }

    function renderProducts() {
        let productsToRender = [...allProducts];

        const searchTerm = searchInput.value.toLowerCase();
        const minPrice = parseFloat(minPriceInput.value) || 0;
        const maxPrice = parseFloat(maxPriceInput.value) || Infinity;

        // Lọc
        if (searchTerm) {
            productsToRender = productsToRender.filter(p =>
                p.name.toLowerCase().includes(searchTerm)
            );
        }
        // Lọc giá
        productsToRender = productsToRender.filter(p =>
            p.price >= minPrice && p.price <= maxPrice
        );

        // Rendering
        productList.innerHTML = '';
        productsToRender.forEach(product => {
            const productElement = createProductElement(product);
            productList.appendChild(productElement);
        });
    }

    // Tải dữ liệu (dùng async/await & fetch)
    async function loadProducts() {
        let dataNeedsMigration = false;
        try {
            // Thử tải từ localStorage trước
            const storedProducts = localStorage.getItem(LOCAL_STORAGE_KEY);

            if (storedProducts) {
                let parsedProducts = JSON.parse(storedProducts);
                if (Array.isArray(parsedProducts)) {
                    parsedProducts.forEach((p, index) => {
                        if (!p.id) {
                            p.id = Date.now() + index;
                            dataNeedsMigration = true;
                        }
                    });
                    allProducts = parsedProducts;
                    if (dataNeedsMigration) {
                        saveProductsToStorage();
                    }
                } else {
                    await fetchOrInitialize();
                }
            } else {
                // Nếu localStorage rỗng, thử tải từ file 'products.json'
                await fetchOrInitialize();
            }
        } catch (e) {
            // Nếu mọi thứ thất bại (vd: JSON hỏng), tạo dữ liệu mẫu
            console.error("Lỗi parse localStorage, tạo lại dữ liệu:", e);
            await fetchOrInitialize();
        }

        renderProducts();
    }

    // Hàm con: Tải từ file JSON hoặc tạo dữ liệu mẫu
    async function fetchOrInitialize(forceInitialize = false) {
        if (!forceInitialize) {
            try {
                // await: Chờ 'fetch' hoàn thành trước khi đi tiếp
                const response = await fetch('products.json'); 
                if (!response.ok) throw new Error('Không tìm thấy file json');
                
                const data = await response.json();
                // Gán ID cho dữ liệu tải từ file JSON
                allProducts = data.map((p, index) => ({
                    ...p,
                    id: Date.now() + index 
                }));
                
            } catch (fetchError) {
                console.warn("Fetch lỗi, quay về dữ liệu mẫu:", fetchError);
                initializeDefaultProducts(); // Fetch lỗi -> Dùng dữ liệu mẫu
            }
        } else {
            initializeDefaultProducts();
        }
        saveProductsToStorage(); // Lưu dữ liệu mới này vào storage
    }

    // Hàm tạo dữ liệu mẫu
    function initializeDefaultProducts() {
        allProducts = [
            { id: Date.now()+1, name: "Bánh mì thịt nướng", price: 25000, desc: "Bánh mì truyền thống..." },
            { id: Date.now()+2, name: "Bánh mì ốp la", price: 20000, desc: "Hai trứng ốp la..." },
            { id: Date.now()+3, name: "Bánh mì chảo", price: 35000, desc: "Một phần ăn đầy đủ..." }
        ];
    }

    // Thêm sản phẩm
    if (addProductForm) {
        addProductForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            const name = document.getElementById('newName').value.trim();
            const price = document.getElementById('newPrice').value.trim();
            const desc = document.getElementById('newDesc').value.trim();

            if (!name || !price || isNaN(price) || Number(price) <= 0) {
                errorMsg.textContent = "Vui lòng nhập tên và giá hợp lệ.";
                return; 
            }
            errorMsg.textContent = "";

            const newProduct = {
                id: Date.now(),
                name: name,
                price: Number(price),
                desc: desc
            };
            
            allProducts.unshift(newProduct); 
            saveProductsToStorage(); 
            renderProducts(); 
            addProductForm.reset(); 
            closeAddForm(); 
        });
    }

    // Xoá sản phẩm
    if (productList) {
        productList.addEventListener('click', function(event) {
            if (event.target.classList.contains('delete-btn')) {
                const productElement = event.target.closest('.product-item');
                const productId = Number(productElement.getAttribute('data-id'));
                allProducts = allProducts.filter(p => p.id !== productId);
                saveProductsToStorage(); 
                renderProducts();
            }
        });
    }

    // Sắp xếp
    if (sortPriceAscBtn) {
        sortPriceAscBtn.addEventListener('click', function () {
            allProducts.sort((a, b) => a.price - b.price);
            renderProducts();
        });
    }

    if (sortPriceDescBtn) {
        sortPriceDescBtn.addEventListener('click', function () {
            allProducts.sort((a, b) => b.price - a.price);
            renderProducts();
        });
    }

    // Lọc
    if (searchBtn) searchBtn.addEventListener('click', renderProducts);
    if (searchInput) searchInput.addEventListener('keyup', renderProducts);
    if (minPriceInput) minPriceInput.addEventListener('input', renderProducts);
    if (maxPriceInput) maxPriceInput.addEventListener('input', renderProducts);

    // Khởi chạy
    loadProducts();
});