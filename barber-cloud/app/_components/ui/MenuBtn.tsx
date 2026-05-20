// "use client"

// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "./sheet"

// import { Avatar, AvatarFallback, AvatarImage } from "./avatar"

// import { Button } from "./button"

// import {
//   CalendarCheck2,
//   ChevronRight,
//   Clock,
//   Crown,
//   Heart,
//   LogInIcon,
//   LogOut,
//   Menu,
//   ScissorsLineDashed,
//   Settings,
//   CircleUser
// } from "lucide-react"

// import { cn } from "@/lib/utils" // já vem com o shadcn
// import { sign, Sign } from "crypto"



// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "./dialog"



// interface MenuBtnProps {
//   className?: string
// }

// import Image from "next/image"
// import { signIn, useSession } from "next-auth/react"

// const MenuBtn = ({ className }: MenuBtnProps) => {

//   // const {data} = useSession()
//   // const handleLoginWitchGoogleClick = () => signIn("google")

//   // return (


//   //           {data?.user ? (
//   //              <SheetTitle className="text-4xl font-black leading-tight tracking-tight text-white">
//   //             Vai deixar o cabelo
//   //             <br />
//   //             na{" "}
//   //             <span className="text-[#C3F32C] drop-shadow-[0_0_8px_#C3F32C]">
//   //               régua?
//   //             </span>
//   //           </SheetTitle>

//   //           <SheetDescription className="pt-1 text-base text-zinc-400">
//   //             Régua{" "}
//   //             <span className="font-semibold text-[#C3F32C]">Máxima.</span>
//   //           </SheetDescription>
//   //         </div>

//   //         <div className="flex justify-center pt-8">
//   //           <div className="relative">
//   //             <div className="absolute inset-0 rounded-full bg-[#C3F32C]/30 blur-3xl" />

//   //             <Avatar className="relative h-52 w-52 border-[3px] border-[#C3F32C] shadow-[0_0_30px_#C3F32C50]">
//   //               <AvatarImage
//   //                 src={data?.user?.image ?? ""}
//   //                 alt="@shadcn"
//   //                 className="object-cover "
//   //               />
//   //               <AvatarFallback>CN</AvatarFallback>
//   //             </Avatar>

//   //             <div className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#C3F32C]/30 bg-zinc-950 px-4 py-2 shadow-lg">
//   //               <Crown className="h-4 w-4 text-[#C3F32C]" />
//   //               <span className="text-xs font-semibold tracking-widest text-[#C3F32C]">
//   //                 VIP
//   //               </span>
//   //             </div>
//   //           </div>
//   //         </div>

//   //         <div className="pt-8 text-center">
//   //           <h1 className="text-3xl font-bold text-white">
//   //             Fala,{" "}
//   //             <span className="text-[#C3F32C] drop-shadow-[0_0_10px_#C3F32C]">
//   //               Bruno
//   //             </span>
//   //           </h1>
//   //           <p className="mt-1 text-sm text-zinc-500">
//   //             Gerencie sua barbearia com precisão.
//   //           </p>
//   //         </div>
//   //           ) : (

//   //                 <Sheet>
//   //     <SheetTrigger asChild>
//   //       <Button
//   //         size="icon"
//   //         variant="ghost"
//   //         className={className ?? "text-white hover:bg-black/10"} // 👈 aqui
//   //       >
//   //         <Menu className="h-6 w-6" />
//   //       </Button>
//   //     </SheetTrigger>

//   //     <SheetContent className="overflow-y-auto border-l border-[#C3F32C]/20 bg-black px-6 text-white backdrop-blur-xl">
//   //       <SheetHeader className="mt-6">
//   //         <div className="space-y-1 text-left">
//   //           <div className="flex items-center justify-between gap-4">
//   //             <div className="flex items-center gap-2">
//   //               <CircleUser className="h-8 w-8 text-[#ffffff]" />
//   //               <h2 className="font-light"> Olá, faça o seu login . . .</h2>
//   //             </div>
              

//   //             <Dialog>
//   //               <DialogTrigger>
//   //                 <Button
//   //                   variant="outline"
//   //                   className="border-[#C3F32C] text-[#C3F32C] hover:bg-[#C3F32C] hover:text-black"
//   //                 >
//   //                   <LogInIcon className="h-4 w-4" />
//   //                 </Button>
//   //               </DialogTrigger>
//   //               <DialogContent>
//   //                 <DialogHeader>
//   //                   <DialogTitle className="text-black">
//   //                     Faça login na plataforma
//   //                   </DialogTitle>
//   //                   <DialogDescription>
//   //                     Conecte-se usando suas credenciais.
//   //                   </DialogDescription>
//   //                   <Button className="mt-4 w-full bg-[#C3F32C] text-black hover:bg-[#C3F32C]/90" onClick={handleLoginWitchGoogleClick}>
//   //                     <Image src="/google-icon.svg" alt="Google Icon" width={16} height={16} className="inline-block mr-2" />
//   //                   </Button>
//   //                   <Button className="mt-2 w-full bg-[#C3F32C] text-black hover:bg-[#C3F32C]/90">
//   //                     <Image src="/facebook-icon.svg" alt="Facebook Icon" width={16} height={16} className="inline-block mr-2" />
//   //                   </Button>
//   //                   <Button className="mt-2 w-full bg-[#C3F32C] text-black hover:bg-[#C3F32C]/90">
//   //                     <Image src="/Apple-icon.svg" alt="Apple Icon" width={16} height={16} className="inline-block mr-2" />
                      
//   //                   </Button>
//   //                   <Button className="mt-2 w-full bg-[#C3F32C] text-black hover:bg-[#C3F32C]/90">
//   //                     <Image src="/GitHub-icon.svg" alt="GitHub Icon" width={16} height={16} className="inline-block mr-2" />
                      
//   //                   </Button>
//   //                 </DialogHeader>
//   //               </DialogContent>
//   //             </Dialog>
//   //           </div>
//   //           )}

//         const { data } = useSession()
// const handleLoginWithGoogleClick = () => signIn("google")

// return (
//   <>
//     {data?.user ? (
//       // Usuário logado
//       <>
//         <SheetTitle className="text-4xl font-black leading-tight tracking-tight text-white">
//           Vai deixar o cabelo
//           <br />
//           na{" "}
//           <span className="text-[#C3F32C] drop-shadow-[0_0_8px_#C3F32C]">
//             régua?
//           </span>
//         </SheetTitle>

//         <SheetDescription className="pt-1 text-base text-zinc-400">
//           Régua{" "}
//           <span className="font-semibold text-[#C3F32C]">Máxima.</span>
//         </SheetDescription>

//         <div className="flex justify-center pt-8">
//           <div className="relative">
//             <div className="absolute inset-0 rounded-full bg-[#C3F32C]/30 blur-3xl" />
//             <Avatar className="relative h-52 w-52 border-[3px] border-[#C3F32C] shadow-[0_0_30px_#C3F32C50]">
//               <AvatarImage
//                 src={data?.user?.image ?? ""}
//                 alt="avatar"
//                 className="object-cover"
//               />
//               <AvatarFallback>CN</AvatarFallback>
//             </Avatar>
//             <div className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#C3F32C]/30 bg-zinc-950 px-4 py-2 shadow-lg">
//               <Crown className="h-4 w-4 text-[#C3F32C]" />
//               <span className="text-xs font-semibold tracking-widest text-[#C3F32C]">
//                 VIP
//               </span>
//             </div>
//           </div>
//         </div>

//         <div className="pt-8 text-center">
//           <h1 className="text-3xl font-bold text-white">
//             Fala,{" "}
//             <span className="text-[#C3F32C] drop-shadow-[0_0_10px_#C3F32C]">
//               {data.user.name}
//             </span>
//           </h1>
//           <p className="mt-1 text-sm text-zinc-500">
//             Gerencie sua barbearia com precisão.
//           </p>
//         </div>
//       </>
//     ) : (
//       // Usuário não logado
//       <div className="flex items-center justify-between gap-4">
//         <div className="flex items-center gap-2">
//           <CircleUser className="h-8 w-8 text-white" />
//           <h2 className="font-light">Olá, faça o seu login . . .</h2>
//         </div>

//         <Dialog>
//           <DialogTrigger asChild> {/* ← asChild evita button dentro de button */}
//             <Button
//               variant="outline"
//               className="border-[#C3F32C] text-[#C3F32C] hover:bg-[#C3F32C] hover:text-black"
//             >
//               <LogInIcon className="h-4 w-4" />
//             </Button>
//           </DialogTrigger>

//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle className="text-black">
//                 Faça login na plataforma
//               </DialogTitle>
//               <DialogDescription>
//                 Conecte-se usando suas credenciais.
//               </DialogDescription>
//             </DialogHeader>

//             <div className="flex flex-col gap-2 mt-4">
//               <Button
//                 className="w-full bg-[#C3F32C] text-black hover:bg-[#C3F32C]/90"
//                 onClick={handleLoginWithGoogleClick}
//               >
//                 <Image src="/google-icon.svg" alt="Google" width={16} height={16} />
//                 Entrar com Google
//               </Button>
//               <Button className="w-full bg-[#C3F32C] text-black hover:bg-[#C3F32C]/90">
//                 <Image src="/facebook-icon.svg" alt="Facebook" width={16} height={16} />
//                 Entrar com Facebook
//               </Button>
//               <Button className="w-full bg-[#C3F32C] text-black hover:bg-[#C3F32C]/90">
//                 <Image src="/Apple-icon.svg" alt="Apple" width={16} height={16} />
//                 Entrar com Apple
//               </Button>
//               <Button className="w-full bg-[#C3F32C] text-black hover:bg-[#C3F32C]/90">
//                 <Image src="/GitHub-icon.svg" alt="GitHub" width={16} height={16} />
//                 Entrar com GitHub
//               </Button>
//             </div>
//           </DialogContent>
//         </Dialog>
//       </div>
//     )}

           

//           <div className="mt-10">
//             <div className="mb-5 flex items-center gap-3">
//               <h1 className="text-[11px] font-semibold tracking-[0.25em] text-zinc-500 uppercase">
//                 Menu
//               </h1>
//               <div className="h-px flex-1 bg-zinc-900" />
//             </div>

//             <div className="overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950/40">
//               <Button className="group flex h-auto w-full items-center justify-between rounded-none bg-transparent px-5 py-4 hover:bg-zinc-900/50">
//                 <div className="flex items-center gap-4">
//                   <CalendarCheck2 className="h-5 w-5 text-[#C3F32C]" />
//                   <div className="text-left">
//                     <h2 className="text-sm font-medium text-zinc-100">
//                       Agendar
//                     </h2>
//                     <p className="text-xs text-zinc-500">
//                       Marque seus horários
//                     </p>
//                   </div>
//                 </div>
//                 <ChevronRight className="h-4 w-4 text-zinc-600 transition-all group-hover:translate-x-0.5 group-hover:text-[#C3F32C]" />
//               </Button>

//               <Button className="group flex h-auto w-full items-center justify-between rounded-none border-t border-zinc-900 bg-transparent px-5 py-4 hover:bg-zinc-900/50">
//                 <div className="flex items-center gap-4">
//                   <ScissorsLineDashed className="h-5 w-5 text-[#C3F32C]" />
//                   <div className="text-left">
//                     <h2 className="text-sm font-medium text-zinc-100">
//                       Serviços
//                     </h2>
//                     <p className="text-xs text-zinc-500">
//                       Gerencie seus serviços
//                     </p>
//                   </div>
//                 </div>
//                 <ChevronRight className="h-4 w-4 text-zinc-600 transition-all group-hover:translate-x-0.5 group-hover:text-[#C3F32C]" />
//               </Button>

//               <Button className="group flex h-auto w-full items-center justify-between rounded-none border-t border-zinc-900 bg-transparent px-5 py-4 hover:bg-zinc-900/50">
//                 <div className="flex items-center gap-4">
//                   <Heart className="h-5 w-5 text-[#C3F32C]" />
//                   <div className="text-left">
//                     <h2 className="text-sm font-medium text-zinc-100">
//                       Favoritos
//                     </h2>
//                     <p className="text-xs text-zinc-500">Seus favoritos</p>
//                   </div>
//                 </div>
//                 <ChevronRight className="h-4 w-4 text-zinc-600 transition-all group-hover:translate-x-0.5 group-hover:text-[#C3F32C]" />
//               </Button>

//               <Button className="group flex h-auto w-full items-center justify-between rounded-none border-t border-zinc-900 bg-transparent px-5 py-4 hover:bg-zinc-900/50">
//                 <div className="flex items-center gap-4">
//                   <Clock className="h-5 w-5 text-[#C3F32C]" />
//                   <div className="text-left">
//                     <h2 className="text-sm font-medium text-zinc-100">
//                       Histórico
//                     </h2>
//                     <p className="text-xs text-zinc-500">Veja seu progresso</p>
//                   </div>
//                 </div>
//                 <ChevronRight className="h-4 w-4 text-zinc-600 transition-all group-hover:translate-x-0.5 group-hover:text-[#C3F32C]" />
//               </Button>

//               <Button className="group flex h-auto w-full items-center justify-between rounded-none border-t border-zinc-900 bg-transparent px-5 py-4 hover:bg-zinc-900/50">
//                 <div className="flex items-center gap-4">
//                   <Settings className="h-5 w-5 text-[#C3F32C]" />
//                   <div className="text-left">
//                     <h2 className="text-sm font-medium text-zinc-100">
//                       Configurações
//                     </h2>
//                     <p className="text-xs text-zinc-500">Ajustes da conta</p>
//                   </div>
//                 </div>
//                 <ChevronRight className="h-4 w-4 text-zinc-600 transition-all group-hover:translate-x-0.5 group-hover:text-[#C3F32C]" />
//               </Button>
//             </div>
//           </div>

//           <Button className="mt-6 flex h-auto w-full items-center justify-center gap-3 rounded-2xl border border-[#C3F32C]/30 bg-transparent py-4 hover:bg-[#C3F32C]/10">
//             <LogOut className="h-4 w-4 text-[#C3F32C]" />
//             <span className="text-sm font-medium text-[#C3F32C]">
//               Sair da conta
//             </span>
//           </Button>
//         </SheetHeader>
//       </SheetContent>
//     </Sheet>
//   )
// }

// export default MenuBtn


"use client"

import Image from "next/image"
import { signIn, signOut, useSession } from "next-auth/react"
import { cn } from "@/lib/utils"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet"

import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { Button } from "./button"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog"

import {
  CalendarCheck2,
  ChevronRight,
  Clock,
  Crown,
  Heart,
  LogInIcon,
  LogOut,
  Menu,
  ScissorsLineDashed,
  Settings,
  CircleUser,
} from "lucide-react"

interface MenuBtnProps {
  className?: string
}

const MenuBtn = ({ className }: MenuBtnProps) => {
  const { data } = useSession()
  const handleLoginWithGoogleClick = () => signIn("google")
  const HandleLogoutClick = () => signOut()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className={className ?? "text-white hover:bg-black/10"}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>

      <SheetContent className="overflow-y-auto border-l border-[#C3F32C]/20 bg-black px-6 text-white backdrop-blur-xl">
        <SheetHeader className="mt-6">
          {data?.user ? (
            // Usuário logado
            <>
              <SheetTitle className="text-4xl font-black leading-tight tracking-tight text-white">
                Vai deixar o cabelo
                <br />
                na{" "}
                <span className="text-[#C3F32C] drop-shadow-[0_0_8px_#C3F32C]">
                  régua?
                </span>
              </SheetTitle>

              <SheetDescription className="pt-1 text-base text-zinc-400">
                Régua{" "}
                <span className="font-semibold text-[#C3F32C]">Máxima.</span>
              </SheetDescription>

              <div className="flex justify-center pt-8">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-[#C3F32C]/30 blur-3xl" />
                  <Avatar className="relative h-52 w-52 border-[3px] border-[#C3F32C] shadow-[0_0_30px_#C3F32C50]">
                    <AvatarImage
                      src={data?.user?.image ?? ""}
                      alt="avatar"
                      className="object-cover"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#C3F32C]/30 bg-zinc-950 px-4 py-2 shadow-lg">
                    <Crown className="h-4 w-4 text-[#C3F32C]" />
                    <span className="text-xs font-semibold tracking-widest text-[#C3F32C]">
                      VIP
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-8 text-center">
                <h1 className="text-3xl font-bold text-white">
                  Fala,{" "}
                  <span className="text-[#C3F32C] drop-shadow-[0_0_10px_#C3F32C]">
                    {data.user.name}
                  </span>
                </h1>
                <p className="mt-1 text-sm text-zinc-500">
                  {data?.user?.email}
                </p>
              </div>
            </>
          ) : (
            // Usuário não logado
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <CircleUser className="h-8 w-8 text-white" />
                <h2 className="font-light">Olá, faça o seu login . . .</h2>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-[#C3F32C] text-[#C3F32C] hover:bg-[#C3F32C] hover:text-black"
                  >
                    <LogInIcon className="h-4 w-4" />
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-black">
                      Faça login na plataforma
                    </DialogTitle>
                    <DialogDescription>
                      Conecte-se usando suas credenciais.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="flex flex-col gap-2 mt-4">
                    <Button
                      className="w-full bg-[#C3F32C] text-black hover:bg-[#C3F32C]/90 flex items-center justify-center gap-2"
                      onClick={handleLoginWithGoogleClick}
                    >
                      <Image src="/google-icon.svg" alt="Google" width={16} height={16} />
                      Entrar com Google
                    </Button>
                    <Button className="w-full bg-[#C3F32C] text-black hover:bg-[#C3F32C]/90 flex items-center justify-center gap-2">
                      <Image src="/facebook-icon.svg" alt="Facebook" width={16} height={16} />
                      Entrar com Facebook
                    </Button>
                    <Button className="w-full bg-[#C3F32C] text-black hover:bg-[#C3F32C]/90 flex items-center justify-center gap-2">
                      <Image src="/Apple-icon.svg" alt="Apple" width={16} height={16} />
                      Entrar com Apple
                    </Button>
                    <Button className="w-full bg-[#C3F32C] text-black hover:bg-[#C3F32C]/90 flex items-center justify-center gap-2">
                      <Image src="/GitHub-icon.svg" alt="GitHub" width={16} height={16} />
                      Entrar com GitHub
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}

          <div className="mt-10">
            <div className="mb-5 flex items-center gap-3">
              <h1 className="text-[11px] font-semibold tracking-[0.25em] text-zinc-500 uppercase">
                Menu
              </h1>
              <div className="h-px flex-1 bg-zinc-900" />
            </div>

            <div className="overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950/40">
              <Button className="group flex h-auto w-full items-center justify-between rounded-none bg-transparent px-5 py-4 hover:bg-zinc-900/50">
                <div className="flex items-center gap-4">
                  <CalendarCheck2 className="h-5 w-5 text-[#C3F32C]" />
                  <div className="text-left">
                    <h2 className="text-sm font-medium text-zinc-100">
                      Agendar
                    </h2>
                    <p className="text-xs text-zinc-500">
                      Marque seus horários
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-600 transition-all group-hover:translate-x-0.5 group-hover:text-[#C3F32C]" />
              </Button>

              <Button className="group flex h-auto w-full items-center justify-between rounded-none border-t border-zinc-900 bg-transparent px-5 py-4 hover:bg-zinc-900/50">
                <div className="flex items-center gap-4">
                  <ScissorsLineDashed className="h-5 w-5 text-[#C3F32C]" />
                  <div className="text-left">
                    <h2 className="text-sm font-medium text-zinc-100">
                      Serviços
                    </h2>
                    <p className="text-xs text-zinc-500">
                      Gerencie seus serviços
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-600 transition-all group-hover:translate-x-0.5 group-hover:text-[#C3F32C]" />
              </Button>

              <Button className="group flex h-auto w-full items-center justify-between rounded-none border-t border-zinc-900 bg-transparent px-5 py-4 hover:bg-zinc-900/50">
                <div className="flex items-center gap-4">
                  <Heart className="h-5 w-5 text-[#C3F32C]" />
                  <div className="text-left">
                    <h2 className="text-sm font-medium text-zinc-100">
                      Favoritos
                    </h2>
                    <p className="text-xs text-zinc-500">Seus favoritos</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-600 transition-all group-hover:translate-x-0.5 group-hover:text-[#C3F32C]" />
              </Button>

              <Button className="group flex h-auto w-full items-center justify-between rounded-none border-t border-zinc-900 bg-transparent px-5 py-4 hover:bg-zinc-900/50">
                <div className="flex items-center gap-4">
                  <Clock className="h-5 w-5 text-[#C3F32C]" />
                  <div className="text-left">
                    <h2 className="text-sm font-medium text-zinc-100">
                      Histórico
                    </h2>
                    <p className="text-xs text-zinc-500">Veja seu progresso</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-600 transition-all group-hover:translate-x-0.5 group-hover:text-[#C3F32C]" />
              </Button>

              <Button className="group flex h-auto w-full items-center justify-between rounded-none border-t border-zinc-900 bg-transparent px-5 py-4 hover:bg-zinc-900/50">
                <div className="flex items-center gap-4">
                  <Settings className="h-5 w-5 text-[#C3F32C]" />
                  <div className="text-left">
                    <h2 className="text-sm font-medium text-zinc-100">
                      Configurações
                    </h2>
                    <p className="text-xs text-zinc-500">Ajustes da conta</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-600 transition-all group-hover:translate-x-0.5 group-hover:text-[#C3F32C]" />
              </Button>
            </div>
          </div>

          <Button className="mt-6 flex h-auto w-full items-center justify-center gap-3 rounded-2xl border border-[#C3F32C]/30 bg-transparent py-4 hover:bg-[#C3F32C]/10">
            <LogOut className="h-4 w-4 text-[#C3F32C]" />
            <span className="text-sm font-medium text-[#C3F32C]" onClick={HandleLogoutClick}>
              Sair da conta
            </span>
          </Button>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}

export default MenuBtn


