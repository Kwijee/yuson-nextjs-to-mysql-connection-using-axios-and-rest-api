"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "/api/users";

const ConfirmModal = ({ message, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-4 rounded-lg shadow-2xl text-white">
            <p className="mb-3">{message}</p>
            <div className="flex justify-end space-x-2">
                <button onClick={onCancel} className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-500 transition">Cancel</button>
                <button onClick={onConfirm} className="px-3 py-1 bg-red-700 rounded hover:bg-red-600 transition">Delete</button>
            </div>
        </div>
    </div>
);

export default function HomePage() {
    const [users, setUsers] = useState([]);
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [editingUser, setEditingUser] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");

    const displayError = (msg) => {
        setErrorMsg(msg);
        setTimeout(() => setErrorMsg(""), 5000);
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get(API_BASE_URL);
            setUsers(response.data);
        } catch (error) {
            displayError('Failed to fetch users.');
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleAddUser = async (e) => {
        e.preventDefault();
        if (!newName || !newEmail) return displayError("Name and Email required.");
        try {
            await axios.post(API_BASE_URL, { name: newName, email: newEmail });
            setNewName("");
            setNewEmail("");
            fetchUsers();
        } catch (error) {
            displayError(`Failed to add user.`);
        }
    };

    const handleUpdateUser = async () => {
        if (!editingUser || !editingUser.name || !editingUser.email) return displayError("Name/Email cannot be empty.");
        try {
            await axios.put(`${API_BASE_URL}/${editingUser.id}`, { name: editingUser.name, email: editingUser.email });
            setEditingUser(null);
            fetchUsers();
        } catch (error) {
            displayError(`Failed to update user.`);
        }
    };

    const confirmDelete = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;
        try {
            await axios.delete(`${API_BASE_URL}/${userToDelete.id}`);
            fetchUsers(); 
            setShowDeleteModal(false);
            setUserToDelete(null);
        } catch (error) {
            displayError(`Failed to delete user.`);
        }
    };

    return (
        <div className="p-4 sm:p-8 font-sans min-h-screen bg-gray-900 text-white">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-extrabold text-center mb-8 text-blue-400">Next.js + MySQL CRUD</h1>

                {errorMsg && (
                    <div className="bg-red-900 border border-red-700 text-red-300 p-3 rounded mb-4" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{errorMsg}</span>
                    </div>
                )}
                
                <div className="p-4 mb-6 bg-gray-800 shadow-xl rounded-lg border border-gray-700">
                    <h2 className="text-lg font-semibold mb-3 flex items-center text-gray-200">Add User</h2>
                    <form className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3" onSubmit={handleAddUser}>
                        <input type="text" placeholder="Name" value={newName} onChange={e => setNewName(e.target.value)} required className="flex-1 p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 focus:ring-blue-500"/>
                        <input type="email" placeholder="Email" value={newEmail} onChange={e => setNewEmail(e.target.value)} required className="flex-1 p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 focus:ring-blue-500"/>
                        <button type="submit" className="px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition">Add</button>
                    </form>
                </div>

                {editingUser && (
                    <div className="mb-6 p-4 rounded-lg bg-blue-900/20 border-2 border-blue-500 shadow-xl text-white">
                        <h3 className="text-lg font-bold mb-3 text-blue-400">Editing ID: {editingUser.id}</h3>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 items-center">
                            <input type="text" value={editingUser.name} onChange={e => setEditingUser({ ...editingUser, name: e.target.value })} className="flex-1 p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 focus:ring-blue-500"/>
                            <input type="email" value={editingUser.email} onChange={e => setEditingUser({ ...editingUser, email: e.target.value })} className="flex-1 p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 focus:ring-blue-500"/>
                            <button onClick={handleUpdateUser} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition">Save</button>
                            <button onClick={() => setEditingUser(null)} className="px-4 py-2 bg-gray-500 text-white font-semibold rounded hover:bg-gray-600 transition">Cancel</button>
                        </div>
                    </div>
                )}

                <h2 className="text-xl font-semibold mb-3 text-gray-300">Users List</h2>
                <div className="overflow-x-auto shadow-xl rounded-lg">
                    <table className="min-w-full bg-gray-800">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="px-3 py-2 text-left text-xs text-gray-400 uppercase">ID</th>
                                <th className="px-3 py-2 text-left text-xs text-gray-400 uppercase">Name</th>
                                <th className="px-3 py-2 text-left text-xs text-gray-400 uppercase">Email</th>
                                <th className="px-3 py-2 text-left text-xs text-gray-400 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700 text-white">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-gray-700 transition">
                                    <td className="px-3 py-2 text-sm font-medium">{user.id}</td>
                                    <td className="px-3 py-2 text-sm text-gray-300">{user.name}</td>
                                    <td className="px-3 py-2 text-sm text-gray-300">{user.email}</td>
                                    <td className="px-3 py-2 text-sm space-x-2">
                                        <button onClick={() => setEditingUser(user)} className="px-2 py-1 bg-yellow-600 text-white text-xs font-bold rounded hover:bg-yellow-700 transition">Edit</button>
                                        <button onClick={() => confirmDelete(user)} className="px-2 py-1 bg-red-700 text-white text-xs font-bold rounded hover:bg-red-800 transition">Del</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {showDeleteModal && <ConfirmModal message={`Delete user: ${userToDelete.name}?`} onConfirm={handleDeleteUser} onCancel={() => setShowDeleteModal(false)} />}
        </div>
    );
}