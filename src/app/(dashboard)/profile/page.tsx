"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileForm } from "@/features/user/components/profile-form"
import { ChangePasswordForm } from "@/features/user/components/change-password-form"
import { DebugJwt } from "@/features/user/components/debug-jwt"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProfilePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Profil & Keamanan</h1>
                <p className="text-muted-foreground mt-1">
                    Kelola pengaturan akun dan preferensi keamanan Anda.
                </p>
            </div>

            <Tabs defaultValue="general" className="w-full max-w-4xl">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="general">Informasi Umum</TabsTrigger>
                    <TabsTrigger value="security">Keamanan</TabsTrigger>
                    <TabsTrigger value="debug">Token Debug</TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>Detail Profil</CardTitle>
                            <CardDescription>
                                Kelola informasi pribadi Anda yang tersimpan di sistem.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ProfileForm />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle>Ubah Kata Sandi</CardTitle>
                            <CardDescription>
                                Pastikan akun Anda menggunakan kata sandi yang kuat dan unik untuk tetap aman.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChangePasswordForm />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="debug">
                    <DebugJwt />
                </TabsContent>
            </Tabs>
        </div>
    )
}
