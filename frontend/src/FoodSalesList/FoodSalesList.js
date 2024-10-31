import React, { useEffect, useState } from 'react';
import { getFoodSales, createFoodSale, updateFoodSale, deleteFoodSale } from '../API/axios';

const FoodSalesList = () => {
    const [foodSales, setFoodSales] = useState([]);
    const [editingFoodSale, setEditingFoodSale] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [pageInfo, setPageInfo] = useState({});
    const [pageIndex, setPageIndex] = useState(1); // Page index state
    const [pageSize] = useState(10);
    const [editingId, setEditingId] = useState(null); // Track ID of the row being edited
    const [editForm, setEditForm] = useState({});
    const [search, setSearch] = useState({
        orderDate: '',
        region: '',
        city: '',
        category: '',
        product: '',
        quantity: '',
        unitPrice: '',
        totalPrice: '',
    });
    const [form, setForm] = useState({
        orderDate: '',
        region: '',
        city: '',
        category: '',
        product: '',
        quantity: 0,
        unitPrice: 0,
        totalPrice: 0,
    });
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchData = async () => {
        const data = await getFoodSales(pageIndex, pageSize);
        setFoodSales(data.item);
        setPageInfo({
            "pageIndex": data.pageIndex,
            "hasPreviousPage": data.hasPreviousPage,
            "totalPage": data.totalPage,
            "hasNextPage": data.hasNextPage
        })
    };

    useEffect(() => {
        fetchData();
    }, [pageIndex]);

    const handlePreviousPage = () => {
        if (pageInfo.hasPreviousPage) {
            setPageIndex((prevPageIndex) => prevPageIndex - 1);
        }
    };

    const handleNextPage = () => {
        if (pageInfo.hasNextPage) {
            setPageIndex((prevPageIndex) => prevPageIndex + 1);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingFoodSale) {
            console.log(editingFoodSale);
            await updateFoodSale(editingFoodSale.id, form);
        } else {
            const createForm = {
                orderDate: form.orderDate,
                region: form.region,
                city: form.city,
                category: form.category,
                product: form.product,
                quantity: form.quantity,
                unitPrice: form.unitPrice,
                totalPrice: form.totalPrice
            }
            await createFoodSale(createForm);
        }
        setForm({ orderDate: '', region: '', city: '', category: '', product: '', quantity: 0, unitPrice: 0, totalPrice: 0 });
        setEditingFoodSale(null);
        fetchData();
    };


    const handleEdit = (sale) => {
        setEditingId(sale.id);
        setEditForm(sale);
    };
    const handleEditChange = (e, field) => {
        const value = e.target.value;

        setEditForm((prevForm) => {
            const updatedForm = { ...prevForm, [field]: value };

            // Calculate totalPrice based on updated quantity or unitPrice
            if (field === 'quantity' || field === 'unitPrice') {
                const quantity = parseFloat(updatedForm.quantity) || 0;
                const unitPrice = parseFloat(updatedForm.unitPrice) || 0;
                updatedForm.totalPrice = quantity * unitPrice;
            }

            return updatedForm;
        });
    };

    const handleSave = async () => {
        await updateFoodSale(editingId, editForm); // Save updated data
        setEditingId(null); // Exit edit mode
        fetchData(); // Refresh data
    };

    const handleCancel = () => {
        setEditingId(null); // Exit edit mode without saving
    };

    const handleDelete = async (id) => {
        await deleteFoodSale(id);
        fetchData();
    };

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleSearchChange = (e, column) => {
        setSearch((prevSearch) => ({
            ...prevSearch,
            [column]: e.target.value
        }));
    };

    // Filter and sort the food sales data
    const filteredFoodSales = foodSales.filter((sale) => {
        const saleDate = new Date(sale.orderDate);
        const isWithinDateRange =
            (!startDate || saleDate >= new Date(startDate)) &&
            (!endDate || saleDate <= new Date(endDate));

        return (
            isWithinDateRange &&
            (search.orderDate === '' || saleDate.toLocaleDateString().includes(search.orderDate)) &&
            (search.region === '' || sale.region.toLowerCase().includes(search.region.toLowerCase())) &&
            (search.city === '' || sale.city.toLowerCase().includes(search.city.toLowerCase())) &&
            (search.category === '' || sale.category.toLowerCase().includes(search.category.toLowerCase())) &&
            (search.product === '' || sale.product.toLowerCase().includes(search.product.toLowerCase())) &&
            (search.quantity === '' || sale.quantity.toString().includes(search.quantity)) &&
            (search.unitPrice === '' || sale.unitPrice.toString().includes(search.unitPrice)) &&
            (search.totalPrice === '' || sale.totalPrice.toString().includes(search.totalPrice))
        );
    });


    const sortedFoodSales = [...filteredFoodSales].sort((a, b) => {
        if (sortConfig.key) {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];
            if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
        }
        return 0;
    });

    return (
        <div className='p-5'>
            <div className='border border-primary p-3'>
                <h2 className="text-center mb-4">Search List</h2>
                <div className="row g-2 mb-3">
                    <div className="col-md-3">
                        <input
                            type="date"
                            placeholder="Start Date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className="col-md-3">
                        <input
                            type="date"
                            placeholder="End Date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <div className="col-md-3">
                        <input
                            type="text"
                            placeholder="Region"
                            value={search.region}
                            onChange={(e) => handleSearchChange(e, 'region')}
                        />
                    </div>
                    <div className="col-md-3">
                        <input
                            type="text"
                            placeholder="City"
                            value={search.city}
                            onChange={(e) => handleSearchChange(e, 'city')}
                        />
                    </div>
                    <div className="col-md-3">
                        <input
                            type="text"
                            placeholder="Category"
                            value={search.category}
                            onChange={(e) => handleSearchChange(e, 'category')}
                        />
                    </div>
                    <div className="col-md-3">
                        <input
                            type="text"
                            placeholder="Product"
                            value={search.product}
                            onChange={(e) => handleSearchChange(e, 'product')}
                        />
                    </div>
                    <div className="col-md-3">
                        <input
                            type="text"
                            placeholder="Quantity"
                            value={search.quantity}
                            onChange={(e) => handleSearchChange(e, 'quantity')}
                        />
                    </div>
                    <div className="col-md-3">
                        <input
                            type="text"
                            placeholder="Unit Price"
                            value={search.unitPrice}
                            onChange={(e) => handleSearchChange(e, 'unitPrice')}
                        />
                    </div>
                    <div className="col-md-3">
                        <input
                            type="text"
                            placeholder="Total Price"
                            value={search.totalPrice}
                            onChange={(e) => handleSearchChange(e, 'totalPrice')}
                        />
                    </div>
                </div>
                <table className="table table-striped table-bordered">
                    <thead className="table-dark">
                        <tr>
                            <th onClick={() => handleSort('orderDate')}>Order Date</th>
                            <th onClick={() => handleSort('region')}>Region</th>
                            <th onClick={() => handleSort('city')}>City</th>
                            <th onClick={() => handleSort('category')}>Category</th>
                            <th onClick={() => handleSort('product')}>Product</th>
                            <th onClick={() => handleSort('quantity')}>Quantity</th>
                            <th onClick={() => handleSort('unitPrice')}>Unit Price</th>
                            <th onClick={() => handleSort('totalPrice')}>Total Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedFoodSales.map((sale) => (
                            <tr key={sale.id}>
                                <td>
                                    {editingId === sale.id ? (
                                        <input
                                            type="date"
                                            value={new Date(editForm.orderDate).toISOString().split('T')[0]}
                                            onChange={(e) => handleEditChange(e, 'orderDate')}
                                        />
                                    ) : (
                                        new Date(sale.orderDate).toLocaleDateString('en-GB')
                                    )}
                                </td>
                                <td>
                                    {editingId === sale.id ? (
                                        <input
                                            type="text"
                                            value={editForm.region}
                                            onChange={(e) => handleEditChange(e, 'region')}
                                        />
                                    ) : (
                                        sale.region
                                    )}
                                </td>
                                <td>
                                    {editingId === sale.id ? (
                                        <input
                                            type="text"
                                            value={editForm.city}
                                            onChange={(e) => handleEditChange(e, 'city')}
                                        />
                                    ) : (
                                        sale.city
                                    )}
                                </td>
                                <td>
                                    {editingId === sale.id ? (
                                        <input
                                            type="text"
                                            value={editForm.category}
                                            onChange={(e) => handleEditChange(e, 'category')}
                                        />
                                    ) : (
                                        sale.category
                                    )}
                                </td>
                                <td>
                                    {editingId === sale.id ? (
                                        <input
                                            type="text"
                                            value={editForm.product}
                                            onChange={(e) => handleEditChange(e, 'product')}
                                        />
                                    ) : (
                                        sale.product
                                    )}
                                </td>
                                <td>
                                    {editingId === sale.id ? (
                                        <input
                                            type="number"
                                            value={editForm.quantity}
                                            onChange={(e) => handleEditChange(e, 'quantity')}
                                        />
                                    ) : (
                                        sale.quantity
                                    )}
                                </td>
                                <td>
                                    {editingId === sale.id ? (
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={editForm.unitPrice}
                                            onChange={(e) => handleEditChange(e, 'unitPrice')}
                                        />
                                    ) : (
                                        sale.unitPrice
                                    )}
                                </td>
                                <td>
                                    {editingId === sale.id ? (
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={editForm.totalPrice}
                                            readOnly
                                        />
                                    ) : (
                                        sale.totalPrice
                                    )}
                                </td>
                                <td>
                                    {editingId === sale.id ? (
                                        <>
                                            <button className="btn btn-success btn-sm me-2" onClick={handleSave}>
                                                Save
                                            </button>
                                            <button className="btn btn-secondary btn-sm" onClick={handleCancel}>
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(sale)}>
                                                Edit
                                            </button>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(sale.id)}>
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination-controls d-flex justify-content-between align-items-center mt-3">
                    <button className="btn btn-outline-primary" onClick={handlePreviousPage} disabled={!pageInfo.hasPreviousPage}>
                        &larr; Previous
                    </button>
                    <span>Page {pageIndex} of {pageInfo.totalPage}</span>
                    <button className="btn btn-outline-primary" onClick={handleNextPage} disabled={!pageInfo.hasNextPage}>
                        Next &rarr;
                    </button>
                </div>
            </div>

            <form className="row g-3 mb-4 border border-success mt-4 p-3" onSubmit={handleSubmit}>
                <div className="col-md-4">
                    <input
                        type="date"
                        placeholder="Order Date"
                        value={form.orderDate}
                        onChange={(e) => setForm({ ...form, orderDate: e.target.value })}
                    />
                </div>
                <div className="col-md-4">
                    <input
                        type="text"
                        placeholder="Region"
                        value={form.region}
                        onChange={(e) => setForm({ ...form, region: e.target.value })}
                    />
                </div>
                <div className="col-md-4">
                    <input
                        type="text"
                        placeholder="City"
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                    />
                </div>
                <div className="col-md-4">
                    <input
                        type="text"
                        placeholder="Category"
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                    />
                </div>
                <div className="col-md-4">
                    <input
                        type="text"
                        placeholder="Product"
                        value={form.product}
                        onChange={(e) => setForm({ ...form, product: e.target.value })}
                    />
                </div>
                <div className="col-md-4">
                    <input
                        type="number"
                        placeholder="Quantity"
                        value={form.quantity}
                        onChange={(e) => {
                            const quantity = parseInt(e.target.value) || 0;
                            setForm({
                                ...form,
                                quantity,
                                totalPrice: quantity * form.unitPrice
                            });
                        }}
                    />
                </div>
                <div className="col-md-4">
                    <input
                        type="number"
                        placeholder="Unit Price"
                        step="0.01"
                        value={form.unitPrice}
                        onChange={(e) => {
                            const unitPrice = parseFloat(e.target.value) || 0;
                            setForm({
                                ...form,
                                unitPrice,
                                totalPrice: form.quantity * unitPrice
                            });
                        }}
                    />
                </div>
                <div className="col-md-4">
                    <input
                        type="number"
                        placeholder="Total Price"
                        step="0.01"
                        value={form.totalPrice}
                        readOnly
                    />
                </div>
                <div className="col-12 mt-3">
                    <button type="submit" className="btn btn-primary btn-lg w-100">
                        {editingFoodSale ? 'Update' : 'Add'} Food Sale
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FoodSalesList;
