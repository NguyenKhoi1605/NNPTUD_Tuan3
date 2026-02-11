// Biến lưu trữ toàn bộ dữ liệu sản phẩm
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
let itemsPerPage = 10;
let sortType = null; // 'price-asc', 'price-desc', 'title-asc', 'title-desc'
let sortDirection = 'asc'; // 'asc' hoặc 'desc'

// Hàm getAll để lấy toàn bộ dữ liệu sản phẩm từ API
async function getAll() {
    try {
        let res = await fetch('https://api.escuelajs.co/api/v1/products');
        if (res.ok) {
            allProducts = await res.json();
            filteredProducts = allProducts;
            currentPage = 1;
            displayPage(currentPage);
        } else {
            console.log('Lỗi khi lấy dữ liệu:', res.status);
        }
    } catch (error) {
        console.log('Lỗi:', error);
    }
}

// Hàm hiển thị một trang cụ thể
function displayPage(pageNum) {
    const startIndex = (pageNum - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageProducts = filteredProducts.slice(startIndex, endIndex);
    
    let bodyTable = document.getElementById('body-table');
    bodyTable.innerHTML = '';
    
    for (const product of pageProducts) {
        bodyTable.innerHTML += convertObjToHTML(product);
    }
    
    // Cập nhật hiển thị phân trang
    renderPagination();
}

// Hàm render các nút phân trang
function renderPagination() {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    let paginationHTML = `<div style="text-align: center; margin-top: 20px;">`;
    
    // Nút Previous
    if (currentPage > 1) {
        paginationHTML += `<button onclick="goToPage(${currentPage - 1})" style="padding: 8px 12px; margin: 5px; cursor: pointer;">← Previous</button>`;
    }
    
    // Các nút số trang
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            paginationHTML += `<button style="padding: 8px 12px; margin: 5px; background-color: #333; color: white; cursor: pointer;">${i}</button>`;
        } else {
            paginationHTML += `<button onclick="goToPage(${i})" style="padding: 8px 12px; margin: 5px; cursor: pointer;">${i}</button>`;
        }
    }
    
    // Nút Next
    if (currentPage < totalPages) {
        paginationHTML += `<button onclick="goToPage(${currentPage + 1})" style="padding: 8px 12px; margin: 5px; cursor: pointer;">Next →</button>`;
    }
    
    paginationHTML += `<p style="margin-top: 10px;">Trang ${currentPage} của ${totalPages} | Tổng: ${filteredProducts.length} sản phẩm</p>`;
    paginationHTML += `</div>`;
    
    document.getElementById('pagination-container').innerHTML = paginationHTML;
}

// Hàm để đi tới một trang cụ thể
function goToPage(pageNum) {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    if (pageNum >= 1 && pageNum <= totalPages) {
        currentPage = pageNum;
        displayPage(currentPage);
        // Scroll lên đầu trang
        window.scrollTo(0, 0);
    }
}

// Hàm thay đổi số lượng mục mỗi trang
function changeItemsPerPage(num) {
    itemsPerPage = num;
    currentPage = 1;
    displayPage(currentPage);
}

// Hàm hiển thị danh sách sản phẩm
function displayProducts(products) {
    filteredProducts = products;
    currentPage = 1;
    displayPage(currentPage);
}

// Hàm tìm kiếm theo title
function searchByTitle(searchText) {
    const searchTerm = searchText.toLowerCase().trim();
    
    if (searchTerm === '') {
        // Nếu input rỗng, hiển thị tất cả
        filteredProducts = allProducts;
    } else {
        // Lọc sản phẩm theo title
        filteredProducts = allProducts.filter(product => 
            product.title.toLowerCase().includes(searchTerm)
        );
    }
    
    // Reset về trang 1 và hiển thị
    currentPage = 1;
    displayPage(currentPage);
}

// Hàm sắp xếp theo giá
function sortByPrice() {
    if (sortType === 'price') {
        // Tận tiếp, đảo chiều
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortType = 'price';
        sortDirection = 'asc';
    }
    
    filteredProducts.sort((a, b) => {
        if (sortDirection === 'asc') {
            return a.price - b.price;
        } else {
            return b.price - a.price;
        }
    });
    
    currentPage = 1;
    displayPage(currentPage);
    updateSortButtonsStyle();
}

// Hàm sắp xếp theo tên
function sortByTitle() {
    if (sortType === 'title') {
        // Tận tiếp, đảo chiều
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortType = 'title';
        sortDirection = 'asc';
    }
    
    filteredProducts.sort((a, b) => {
        if (sortDirection === 'asc') {
            return a.title.localeCompare(b.title);
        } else {
            return b.title.localeCompare(a.title);
        }
    });
    
    currentPage = 1;
    displayPage(currentPage);
    updateSortButtonsStyle();
}

// Hàm cập nhật style của nút sắp xếp
function updateSortButtonsStyle() {
    const priceBtn = document.getElementById('sort-price-btn');
    const titleBtn = document.getElementById('sort-title-btn');
    
    // Reset cả nút
    if (priceBtn) priceBtn.style.backgroundColor = '#f5f5f5';
    if (titleBtn) titleBtn.style.backgroundColor = '#f5f5f5';
    
    // Tô màu nút đang hoạt động
    if (sortType === 'price' && priceBtn) {
        priceBtn.style.backgroundColor = '#333';
        priceBtn.style.color = 'white';
        priceBtn.textContent = `Sắp xếp Giá ${sortDirection === 'asc' ? '↑' : '↓'}`;
    }
    if (sortType === 'title' && titleBtn) {
        titleBtn.style.backgroundColor = '#333';
        titleBtn.style.color = 'white';
        titleBtn.textContent = `Sắp xếp Tên ${sortDirection === 'asc' ? '↑' : '↓'}`;
    }
}

function convertObjToHTML(product) {
    // Lấy hình ảnh đầu tiên từ mảng images
    let imageUrl = product.images && product.images.length > 0 ? product.images[0] : 'No Image';
    
    return `<tr>
        <td>${product.id}</td>
        <td>${product.title}</td>
        <td>$${product.price}</td>
        <td>
            ${imageUrl !== 'No Image' ? `<img src="${imageUrl}" alt="${product.title}" class="product-image">` : 'No Image'}
        </td>
        <td>${product.description ? product.description.substring(0, 50) + '...' : 'N/A'}</td>
    </tr>`;
}

// Gọi hàm getAll khi trang tải
getAll();
