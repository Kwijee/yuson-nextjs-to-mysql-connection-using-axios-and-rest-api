import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function PUT(request, { params }) {
    const { id } = await params; 
    try {
        const body = await request.json();
        const { name, email } = body;

        if (!name || !email) {
            return NextResponse.json(
                { message: 'Name and email are required' },
                { status: 400 }
            );
        }

        const connection = await pool.getConnection();
        const [updateResult] = await connection.execute(
            'UPDATE users SET name = ?, email = ? WHERE id = ?',
            [name, email, id]
        );
        connection.release();

        if (updateResult.affectedRows === 0) {
            return NextResponse.json({ message: `User with id ${id} not found` }, { status: 404 });
        }
        
        return NextResponse.json({ id, name, email, message: 'User updated successfully' });

    } catch (error) {
        console.error('API Error (PUT):', error);
        return NextResponse.json(
            { message: 'Database operation failed', error: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    const { id } = await params; 
    try {
        const connection = await pool.getConnection();
        const [deleteResult] = await connection.execute(
            'DELETE FROM users WHERE id = ?',
            [id]
        );
        connection.release();

        if (deleteResult.affectedRows === 0) {
            return NextResponse.json({ message: `User with id ${id} not found` }, { status: 404 });
        }
        
        return NextResponse.json({ id, message: 'User deleted successfully' });

    } catch (error) {
        console.error('API Error (DELETE):', error);
        return NextResponse.json(
            { message: 'Database operation failed', error: error.message },
            { status: 500 }
        );
    }
}