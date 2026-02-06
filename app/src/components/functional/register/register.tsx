"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Mail,
  Lock,
  User,
  Phone,
  Loader2,
  UserPlus,
  Zap,
  Users,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "@/store/hooks";
import { registerSchema, type RegisterFormData } from "@/schemas/auth";
import { useState } from "react";

const Register = () => {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nombres: "",
      apellidos: "",
      email: "",
      telefono: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setSubmitError("");
    try {
      await register({
        names: data.nombres,
        lastNames: data.apellidos,
        phone: data.telefono,
        email: data.email,
        password: data.password,
      });
      router.push("/dashboard");
    } catch {
      setSubmitError("Error al registrar. Por favor, intenta nuevamente.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute w-[600px] h-[600px] top-0 left-0 -translate-x-1/4 -translate-y-1/4 bg-primary/15 rounded-full blur-3xl"></div>
        <div className="absolute w-[600px] h-[600px] bottom-0 right-0 translate-x-1/4 translate-y-1/4 bg-primary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] opacity-[0.08] animate-float-slow">
          <div className="relative w-full h-full">
            <Image
              src="/logo_black_red.jpg"
              alt=""
              fill
              className="object-contain animate-spin-slow"
              unoptimized
            />
          </div>
        </div>

        <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] opacity-[0.06] animate-float-reverse">
          <div className="relative w-full h-full">
            <Image
              src="/logo_white_red.jpeg"
              alt=""
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        </div>

        <div className="absolute bottom-1/4 left-1/3 w-[350px] h-[350px] opacity-[0.07] animate-float-slow-delayed">
          <div className="relative w-full h-full">
            <Image
              src="/logo_black.jpeg"
              alt=""
              fill
              className="object-contain animate-spin-slow-reverse"
              unoptimized
            />
          </div>
        </div>

        <div className="absolute top-1/3 right-1/3 w-[250px] h-[250px] opacity-[0.05] animate-float">
          <div className="relative w-full h-full">
            <Image
              src="/logo_white.jpg"
              alt=""
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        </div>

        <div className="absolute bottom-1/3 right-1/5 w-[280px] h-[280px] opacity-[0.06] animate-float-delayed">
          <div className="relative w-full h-full">
            <Image
              src="/logo_black_red.jpg"
              alt=""
              fill
              className="object-contain animate-spin-slow"
              unoptimized
            />
          </div>
        </div>

        <div className="absolute top-1/2 left-1/5 w-[320px] h-[320px] opacity-[0.05] animate-float-reverse-delayed">
          <div className="relative w-full h-full">
            <Image
              src="/logo_white.jpg"
              alt=""
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 pointer-events-none z-0"></div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
        <div className="hidden lg:flex flex-col space-y-6 fade-in text-white">
          <h1 className="font-bold text-7xl leading-tight tracking-tight">
            FEEL THE <br />
            <span className="metallic-text">
              BEAT
            </span>{" "}
            <br />
            D-THRE3
          </h1>
          <p className="text-gray-400 text-xl max-w-md">
            Únete a la comunidad de baile más vibrante. Domina el escenario,
            encuentra tu ritmo y rompe los límites.
          </p>
          <div className="flex space-x-4">
            <div className="p-4 glass-card rounded-xl flex items-center space-x-3">
              <Zap className="text-primary text-2xl" />
              <span>Energía Pura</span>
            </div>
            <div className="p-4 glass-card rounded-xl flex items-center space-x-3">
              <Users className="text-primary text-2xl" />
              <span>Comunidad</span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto fade-in">
          <div className="mb-8 text-center lg:hidden">
            <h2 className="font-bold text-4xl text-white">D-THRE3</h2>
          </div>

          <div className="relative">
            <div className="glass-card rounded-xl p-8 auth-card-glow">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Crear Cuenta
                </h2>
                <p className="text-gray-400">
                  Completa tus datos básicos para registrarte
                </p>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="nombres"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-400">Nombres</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 z-10" />
                            <Input
                              type="text"
                              placeholder="Tu nombre"
                              className="pl-10 bg-black/40 border-gray-700 text-white focus:border-primary focus:ring-primary/20"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="apellidos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-400">
                          Apellidos
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 z-10" />
                            <Input
                              type="text"
                              placeholder="Tus apellidos"
                              className="pl-10 bg-black/40 border-gray-700 text-white focus:border-primary focus:ring-primary/20"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-400">Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 z-10" />
                            <Input
                              type="email"
                              placeholder="tu@email.com"
                              className="pl-10 bg-black/40 border-gray-700 text-white focus:border-primary focus:ring-primary/20"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="telefono"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-400">
                          Teléfono
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 z-10" />
                            <Input
                              type="tel"
                              placeholder="Tu teléfono"
                              className="pl-10 bg-black/40 border-gray-700 text-white focus:border-primary focus:ring-primary/20"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-400">
                          Contraseña
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 z-10" />
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="pl-10 pr-10 bg-black/40 border-gray-700 text-white focus:border-primary focus:ring-primary/20"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors z-10"
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {submitError && (
                    <p className="text-sm text-destructive text-center">
                      {submitError}
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-red-800 hover:opacity-90 py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <UserPlus className="h-4 w-4 mr-2" />
                    )}
                    CREAR CUENTA
                  </Button>
                </form>
              </Form>

              <div className="mt-6 text-center text-sm text-gray-400">
                ¿Ya tienes cuenta?{" "}
                <Link
                  href="/login"
                  className="text-primary hover:text-primary/80 underline"
                >
                  Inicia sesión aquí
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
