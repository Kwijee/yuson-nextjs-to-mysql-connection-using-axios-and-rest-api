import { NextResponse } from 'next/server';
import pool from '../../lib/db';

export async function GET() {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM users');
        connection.release();
        return NextResponse.json(rows); 
    } catch (error) {
        console.error('API Error (GET):', error);
        return NextResponse.json(
            { message: 'Database operation failed', error: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request) {
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
        const [result] = await connection.execute(
            'INSERT INTO users (name, email) VALUES (?, ?)',
            [name, email]
        );
        connection.release();
        
        return NextResponse.json(
            { id: result.insertId, name, email },
            { status: 201 } 
        );

    } catch (error) {
        console.error('API Error (POST):', error);
        return NextResponse.json(
            { message: 'Database operation failed', error: error.message },
            { status: 500 }
        );
    }
}