"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { jwtDecode } from "jwt-decode"
import { useEffect, useState } from "react"

export function DebugJwt() {
    const [decodedToken, setDecodedToken] = useState<any>(null)
    const [rawToken, setRawToken] = useState<string | null>(null)

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            setRawToken(token)
            try {
                const decoded = jwtDecode(token)
                setDecodedToken(decoded)
            } catch (error) {
                console.error("Failed to decode token", error)
            }
        }
    }, [])

    if (!rawToken) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Token Tidak Ditemukan</CardTitle>
                    <CardDescription>Anda belum login atau token hilang dari sesi lokal.</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Debugger JWT</CardTitle>
                <CardDescription>
                    Informasi ini tersimpan dalam sesi lokal (localStorage) Anda.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h3 className="font-semibold mb-2">Payload Terdekode:</h3>
                    <pre className="bg-muted p-4 rounded-md overflow-auto text-xs font-mono">
                        {JSON.stringify(decodedToken, null, 2)}
                    </pre>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Token Mentah (Diringkas):</h3>
                    <code className="bg-muted p-2 rounded block break-all text-xs">
                        {rawToken.substring(0, 50)}...{rawToken.substring(rawToken.length - 20)}
                    </code>
                </div>
            </CardContent>
        </Card>
    )
}
