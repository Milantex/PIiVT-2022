import React from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
    return (
        <div className="row">
            <div className="col-12 col-lg-4 col-md-6 col-xl-3 p-3">
                <div className="card">
                    <div className="card-body">
                        <div className="card-title">
                            <h2 className="h5">Categories</h2>
                        </div>
                        <div className="card-text d-grid gap-3">
                            <Link className="btn btn-primary" to="/admin/dashboard/category/list">List all categories</Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12 col-lg-4 col-md-6 col-xl-3 p-3">
                <div className="card">
                    <div className="card-body">
                        <div className="card-title">
                            <h2 className="h5">Orders</h2>
                        </div>
                        <div className="card-text d-grid gap-3">
                            <Link className="btn btn-primary" to="/admin/dashboard/order/list/new">List new orders</Link>
                            <Link className="btn btn-primary" to="/admin/dashboard/order/list/arhive">List old orders</Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12 col-lg-4 col-md-6 col-xl-3 p-3">
                <div className="card">
                    <div className="card-body">
                        <div className="card-title">
                            <h2 className="h5">Administrators</h2>
                        </div>
                        <div className="card-text d-grid gap-3">
                            <Link className="btn btn-primary" to="/admin/dashboard/administrator/list">List all administrators</Link>
                            <Link className="btn btn-primary" to="/admin/dashboard/administrator/add">Add a new administrator</Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12 col-lg-4 col-md-6 col-xl-3 p-3">
                <div className="card">
                    <div className="card-body">
                        <div className="card-title">
                            <h2 className="h5">Sizes</h2>
                        </div>
                        <div className="card-text d-grid gap-3">
                            <Link className="btn btn-primary" to="/admin/dashboard/size/list">List all sizes</Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12 col-lg-4 col-md-6 col-xl-3 p-3">
                <div className="card">
                    <div className="card-body">
                        <div className="card-title">
                            <h2 className="h5">Users</h2>
                        </div>
                        <div className="card-text d-grid gap-3">
                            <Link className="btn btn-primary" to="/admin/dashboard/user/list">List all user</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
