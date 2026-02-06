import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const res = await fetch('https://localhost:8000/swagger/v1/swagger.json', { cache: 'no-store' });
        if (!res.ok) {
            throw new Error(`Failed to fetch swagger: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Swagger Proxy Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
