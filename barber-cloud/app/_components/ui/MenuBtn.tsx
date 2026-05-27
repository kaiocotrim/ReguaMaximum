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

// "use client"

// import Image from "next/image"
// import { signIn, signOut, useSession } from "next-auth/react"
// import { cn } from "@/lib/utils"

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
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "./dialog"

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
//   CircleUser,
// } from "lucide-react"

// interface MenuBtnProps {
//   className?: string
// }

// const MenuBtn = ({ className }: MenuBtnProps) => {
//   const { data } = useSession()
//   const handleLoginWithGoogleClick = () => signIn("google")
//   const HandleLogoutClick = async () => {
//     await signOut({
//       redirect: false,
//     })

//     window.location.reload()
//   }

//   return (
//     <Sheet>
//       <SheetTrigger asChild>
//         <Button
//           size="icon"
//           variant="ghost"
//           className={className ?? "text-white hover:bg-black/10"}
//         >
//           <Menu className="h-6 w-6" />
//         </Button>
//       </SheetTrigger>

//       <SheetContent className="overflow-y-auto border-l border-[#C3F32C]/20 bg-black px-6 text-white backdrop-blur-xl">
//         <SheetHeader className="mt-6">
//           {data?.user ? (
//             // Usuário logado
//             <>
//               <SheetTitle className="text-4xl leading-tight font-black tracking-tight text-white">
//                 Vai deixar o cabelo
//                 <br />
//                 na{" "}
//                 <span className="text-[#C3F32C] drop-shadow-[0_0_8px_#C3F32C]">
//                   régua?
//                 </span>
//               </SheetTitle>

//               <SheetDescription className="pt-1 text-base text-zinc-400">
//                 Régua{" "}
//                 <span className="font-semibold text-[#C3F32C]">Máxima.</span>
//               </SheetDescription>

//               <div className="flex justify-center pt-8">
//                 <div className="relative">
//                   <div className="absolute inset-0 rounded-full bg-[#C3F32C]/30 blur-3xl" />
//                   <Avatar className="relative h-52 w-52 border-[3px] border-[#C3F32C] shadow-[0_0_30px_#C3F32C50]">
//                     <AvatarImage
//                       src={data?.user?.image ?? ""}
//                       alt="avatar"
//                       className="object-cover"
//                     />
//                     <AvatarFallback>CN</AvatarFallback>
//                   </Avatar>
//                   <div className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#C3F32C]/30 bg-zinc-950 px-4 py-2 shadow-lg">
//                     <Crown className="h-4 w-4 text-[#C3F32C]" />
//                     <span className="text-xs font-semibold tracking-widest text-[#C3F32C]">
//                       VIP
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="pt-8 text-center">
//                 <h1 className="text-3xl font-bold text-white">
//                   Fala,{" "}
//                   <span className="text-[#C3F32C] drop-shadow-[0_0_10px_#C3F32C]">
//                     {data.user.name}
//                   </span>
//                 </h1>
//                 <p className="mt-1 text-sm text-zinc-500">
//                   {data?.user?.email}
//                 </p>
//               </div>
//             </>
//           ) : (
//             // Usuário não logado
//             <div className="flex items-center justify-between gap-4">
//               <div className="flex items-center gap-2">
//                 <CircleUser className="h-8 w-8 text-white" />
//                 <h2 className="font-light">Olá, faça o seu login . . .</h2>
//               </div>

//               <Dialog>
//                 <DialogTrigger asChild>
//                   <Button
//                     variant="outline"
//                     className="border-[#C3F32C] text-[#C3F32C] hover:bg-[#C3F32C] hover:text-black"
//                   >
//                     <LogInIcon className="h-4 w-4" />
//                   </Button>
//                 </DialogTrigger>

//                 <DialogContent>
//                   <DialogHeader>
//                     <DialogTitle className="text-black">
//                       Faça login na plataforma
//                     </DialogTitle>
//                     <DialogDescription>
//                       Conecte-se usando suas credenciais.
//                     </DialogDescription>
//                   </DialogHeader>

//                   <div className="mt-4 flex flex-col gap-2">
//                     <Button
//                       className="flex w-full items-center justify-center gap-2 bg-[#C3F32C] text-black hover:bg-[#C3F32C]/90"
//                       onClick={handleLoginWithGoogleClick}
//                     >
//                       <Image
//                         src="/google-icon.svg"
//                         alt="Google"
//                         width={16}
//                         height={16}
//                       />
//                       Entrar com Google
//                     </Button>
//                     <Button className="flex w-full items-center justify-center gap-2 bg-[#C3F32C] text-black hover:bg-[#C3F32C]/90">
//                       <Image
//                         src="/facebook-icon.svg"
//                         alt="Facebook"
//                         width={16}
//                         height={16}
//                       />
//                       Entrar com Facebook
//                     </Button>
//                     <Button className="flex w-full items-center justify-center gap-2 bg-[#C3F32C] text-black hover:bg-[#C3F32C]/90">
//                       <Image
//                         src="/Apple-icon.svg"
//                         alt="Apple"
//                         width={16}
//                         height={16}
//                       />
//                       Entrar com Apple
//                     </Button>
//                     <Button className="flex w-full items-center justify-center gap-2 bg-[#C3F32C] text-black hover:bg-[#C3F32C]/90">
//                       <Image
//                         src="/GitHub-icon.svg"
//                         alt="GitHub"
//                         width={16}
//                         height={16}
//                       />
//                       Entrar com GitHub
//                     </Button>
//                   </div>
//                 </DialogContent>
//               </Dialog>
//             </div>
//           )}

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

//           <Dialog>
//             {data?.user && (
//             <DialogTrigger asChild>
//               <Button className="mt-6 flex h-auto w-full items-center justify-center gap-3 rounded-2xl border border-[#C3F32C]/30 bg-transparent py-4 transition-all duration-300 hover:bg-[#C3F32C]/10 hover:shadow-[0_0_20px_rgba(195,243,44,0.15)]">
//                 <LogOut className="h-4 w-4 text-[#C3F32C]" />
//                 <span className="text-sm font-medium text-[#C3F32C]">
//                   Sair da conta
//                 </span>
//               </Button>
//             </DialogTrigger> )}

//             <DialogContent className="border border-[#C3F32C]/20 bg-[#0B0B0B] text-white sm:rounded-3xl">
//               <DialogHeader className="space-y-4">
//                 <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
//                   <LogOut className="h-7 w-7 text-red-400" />
//                 </div>

//                 <DialogTitle className="text-center text-xl font-semibold">
//                   Você realmente deseja sair?
//                 </DialogTitle>

//                 <DialogDescription className="text-center text-sm text-zinc-400">
//                   Sua sessão será encerrada e você precisará entrar novamente.
//                 </DialogDescription>

//                 <div className="flex gap-3 pt-4">
//                   <Button
//                     onClick={HandleLogoutClick}
//                     className="w-full rounded-xl bg-red-500 text-white transition-all duration-300 hover:bg-red-600"
//                   >
//                     <LogOut className="mr-2 h-4 w-4" />
//                     Sair
//                   </Button>
//                 </div>
//               </DialogHeader>
//             </DialogContent>
//           </Dialog>
//         </SheetHeader>
//       </SheetContent>
//     </Sheet>
//   )
// }

// // export default MenuBtn
// "use client"

// import Image from "next/image"
// import { signIn, signOut, useSession } from "next-auth/react"

// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetDescription,
//   SheetTrigger,
// } from "./sheet"

// import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
// import { Button } from "./button"

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "./dialog"

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
//   CircleUser,
// } from "lucide-react"

// interface MenuBtnProps {
//   className?: string
// }

// const MENU_ITEMS = [
//   {
//     icon: CalendarCheck2,
//     label: "Agendar",
//     description: "Marque seus horários",
//   },
//   {
//     icon: ScissorsLineDashed,
//     label: "Serviços",
//     description: "Gerencie seus serviços",
//   },
//   { icon: Heart, label: "Favoritos", description: "Seus favoritos" },
//   { icon: Clock, label: "Histórico", description: "Veja seu progresso" },
//   { icon: Settings, label: "Configurações", description: "Ajustes da conta" },
// ]

// const LOGIN_PROVIDERS = [
//   { src: "/google-icon.svg", label: "Google" },
//   { src: "/facebook-icon.svg", label: "Facebook" },
//   { src: "/Apple-icon.svg", label: "Apple" },
//   { src: "/GitHub-icon.svg", label: "GitHub" },
// ]

// const MenuBtn = ({ className }: MenuBtnProps) => {
//   const { data } = useSession()

//   const handleLoginWithGoogleClick = () => signIn("google")
//   const handleLoginWithGithubClick = () => signIn("github")
//   const handleLoginWithFacebookClick = () => signIn("facebook")

//   const handleLogoutClick = async () => {
//     await signOut({ redirect: false })
//     window.location.reload()
//   }

//   return (
//     <Sheet>
//       <SheetTrigger asChild>
//         <Button
//           size="icon"
//           variant="ghost"
//           className={className ?? "text-white hover:bg-white/5"}
//         >
//           <Menu className="h-5 w-5" />
//         </Button>
//       </SheetTrigger>

//       <SheetContent className="flex flex-col overflow-y-auto border-l border-white/[0.08] bg-[#111111]/95 px-5 text-white shadow-[-20px_0_60px_rgba(0,0,0,0.65)] backdrop-blur-2xl">
//         {/* <SheetContent className="flex flex-col overflow-y-auto border- bg-[#131313] px-5 text-white"> */}
//         <SheetHeader className="mt-8 space-y-0">
//           {data?.user ? (
//             <div className="flex flex-col gap-4">
//               {/* Perfil */}
//               <div className="flex items-center gap-4 rounded-2xl bg-[#1f1f1f] p-4">
//                 <div className="relative flex-shrink-0">
//                   <Avatar className="h-13 w-13 rounded-2xl">
//                     <AvatarImage
//                       src={data.user.image ?? ""}
//                       alt="avatar"
//                       className="rounded-2xl object-cover"
//                     />
//                     <AvatarFallback className="rounded-2xl bg-[#C3F32C] text-base font-bold text-black">
//                       CN
//                     </AvatarFallback>
//                   </Avatar>
//                   <span className="absolute -right-1.5 -bottom-1.5 flex items-center gap-0.5 rounded-full border-2 border-[#161616] bg-[#C3F32C] px-1.5 py-0.5 text-[9px] font-black text-black">
//                     <Crown className="h-2 w-2" />
//                     VIP
//                   </span>
//                 </div>
//                 <div className="min-w-0">
//                   <SheetTitle className="truncate text-[15px] font-semibold text-white">
//                     {data.user.name}
//                   </SheetTitle>
//                   <SheetDescription className="truncate text-xs text-[#555]">
//                     {data.user.email}
//                   </SheetDescription>
//                 </div>
//               </div>

//               {/* Headline */}
//               <div className="rounded-2xl border-l-[3px] border-[#C3F32C] bg-[#1f1f1f] px-5 py-[18px]">
//                 <p className="text-xl leading-tight font-black tracking-tight text-white">
//                   Vai deixar o cabelo <br />
//                   na <span className="text-[#C3F32C]">régua?</span>
//                 </p>
//                 <p className="mt-1 text-xs font-medium text-[#444]">
//                   Régua <span className="text-[#C3F32C]/70">Máxima.</span>
//                 </p>
//               </div>
//             </div>
//           ) : (
//             <div className="flex items-center justify-between rounded-2xl bg-[#1f1f1f] px-4 py-3">
//               <div className="flex items-center gap-2">
//                 <CircleUser className="h-5 w-5 text-[#555]" />
//                 <SheetTitle className="text-sm font-normal text-[#555]">
//                   Faça o seu login
//                 </SheetTitle>
//               </div>

//               <Dialog>
//                 <DialogTrigger asChild>
//                   <Button
//                     size="sm"
//                     className="h-8 rounded-xl bg-[#C3F32C] text-xs font-bold text-black hover:bg-[#d4f542]"
//                   >
//                     <LogInIcon className="mr-1.5 h-3.5 w-3.5 text-[#254F50]" />
//                     <p className="text-[#254F50]">Entrar</p>
//                   </Button>
//                 </DialogTrigger>

//                 <DialogContent className="border-none bg-[#1c1c1c] text-white">
//                   <DialogHeader>
//                     <DialogTitle className="text-white">
//                       Entrar na plataforma
//                     </DialogTitle>
//                     <DialogDescription className="text-[#555]">
//                       Escolha como deseja continuar.
//                     </DialogDescription>
//                   </DialogHeader>

//                   <div className="mt-3 flex flex-col gap-2">
//                     {LOGIN_PROVIDERS.map(({ src, label }) => (
//                       <Button
//                         key={label}
//                         onClick={
//                           label === "Google"
//                             ? handleLoginWithGoogleClick
//                             : label === "GitHub"
//                               ? handleLoginWithGithubClick
//                               : label === "Facebook"
//                                 ? handleLoginWithFacebookClick
//                                 : undefined
//                         }
//                         className="w-full justify-start gap-3 rounded-xl bg-[#C3F32C] text-sm text-black hover:bg-[#d6f083]"
//                       >
//                         <Image src={src} alt={label} width={16} height={16} />
//                         Continuar com {label}
//                       </Button>
//                     ))}
//                   </div>
//                 </DialogContent>
//               </Dialog>
//             </div>
//           )}
//         </SheetHeader>

//         {/* Menu */}
//         <nav className="mt-6">
//           <div className="mb-3 flex items-center gap-3 px-1">
//             <span className="text-[10px] font-bold tracking-[0.15em] text-[#333] uppercase">
//               Menu
//             </span>
//             <div className="h-px flex-1 bg-[#222]" />
//           </div>

//           <div className="flex flex-col gap-0.5">
//             {MENU_ITEMS.map(({ icon: Icon, label, description }) => (
//               <Button
//                 key={label}
//                 variant="ghost"
//                 className="group flex h-auto w-full items-center justify-between rounded-xl bg-[#1a1a1a] px-3.5 py-3 hover:bg-[#222]"
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px] bg-[#C3F32C]/10">
//                     <Icon className="h-[17px] w-[17px] text-[#C3F32C]" />
//                   </div>
//                   <div className="text-left">
//                     <p className="text-[14px] font-semibold text-[#eee]">
//                       {label}
//                     </p>
//                     <p className="text-[11px] text-[#444]">{description}</p>
//                   </div>
//                 </div>
//                 <ChevronRight className="h-4 w-4 flex-shrink-0 text-[#333] transition-all group-hover:translate-x-0.5 group-hover:text-[#C3F32C]" />
//               </Button>
//             ))}
//           </div>
//         </nav>

//         {/* Logout */}
//         {data?.user && (
//           <div className="mt-auto border-t border-[#1f1f1f] pt-4 pb-6">
//             <Dialog>
//               <DialogTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   className="w-full justify-start gap-3 rounded-xl text-[#555] hover:bg-transparent hover:text-red-500"
//                 >
//                   <LogOut className="h-4 w-4 text-red-500" />
//                   <span className="text-sm font-medium text-red-500">
//                     Sair da conta
//                   </span>
//                 </Button>
//               </DialogTrigger>

//               <DialogContent className="border-none bg-[#161616] text-white">
//                 <DialogHeader className="space-y-5">
//                   <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10">
//                     <LogOut className="h-6 w-6 text-red-500" />
//                   </div>
//                   <div className="space-y-1 text-center">
//                     <DialogTitle className="text-lg font-bold text-white">
//                       Sair da conta?
//                     </DialogTitle>
//                     <DialogDescription className="text-sm text-[#555]">
//                       Sua sessão será encerrada e você precisará entrar
//                       novamente.
//                     </DialogDescription>
//                   </div>
//                   <Button
//                     onClick={handleLogoutClick}
//                     className="w-full rounded-xl bg-red-500 font-bold text-white hover:bg-red-600"
//                   >
//                     Confirmar saída
//                   </Button>
//                 </DialogHeader>
//               </DialogContent>
//             </Dialog>
//           </div>
//         )}
//       </SheetContent>
//     </Sheet>
//   )
// }

// export default MenuBtn


"use client"
import { useRouter } from "next/navigation"



import Image from "next/image"
import { signIn, signOut, useSession } from "next-auth/react"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
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
  House,
} from "lucide-react"

interface MenuBtnProps {
  className?: string
}

const MENU_ITEMS = [
  {
    icon: CalendarCheck2,
    label: "Agendar",
    description: "Marque seus horários",
  },
  {
    icon: ScissorsLineDashed,
    label: "Serviços",
    description: "Gerencie seus serviços",
  },
  { icon: House, label: "Inicio", description: "Volte para tela de inicio", href: "/",},
  { icon: Heart, label: "Favoritos", description: "Seus favoritos" },
  { icon: Clock, label: "Histórico", description: "Veja seu progresso" },
  { icon: Settings, label: "Configurações", description: "Ajustes da conta" },
]


const LOGIN_PROVIDERS = [
  { src: "/google-icon.svg", label: "Google" },
  { src: "/facebook-icon.svg", label: "Facebook" },
  { src: "/Apple-icon.svg", label: "Apple" },
  { src: "/GitHub-icon.svg", label: "GitHub" },
]

const MenuBtn = ({ className }: MenuBtnProps) => {
  const { data } = useSession()

  const router = useRouter()
  const handleLoginWithGoogleClick = () => signIn("google")
  const handleLoginWithGithubClick = () => signIn("github")
  const handleLoginWithFacebookClick = () => signIn("facebook")

  const handleLogoutClick = async () => {
    await signOut({ redirect: false })
    window.location.reload()
  }


  return (

    

    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className={className ?? "text-white hover:bg-white/5"}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent className="flex flex-col overflow-y-auto border-l border-white/[0.08] bg-[#111111]/95 px-5 text-white shadow-[-20px_0_60px_rgba(0,0,0,0.65)] backdrop-blur-2xl">
        <SheetHeader className="mt-8 space-y-0">
          {data?.user ? (
            <div className="flex flex-col gap-4">
              {/* Perfil */}
              <div className="flex items-center gap-4 rounded-2xl border border-white/[0.05] bg-[#1f1f1f] p-4">
                <div className="relative flex-shrink-0">
                  <Avatar className="h-13 w-13 rounded-2xl">
                    <AvatarImage
                      src={data.user.image ?? ""}
                      alt="avatar"
                      className="rounded-2xl object-cover"
                    />
                    <AvatarFallback className="rounded-2xl bg-[#C3F32C] text-base font-bold text-black">
                      CN
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute -right-1.5 -bottom-1.5 flex items-center gap-0.5 rounded-full border-2 border-[#161616] bg-[#C3F32C] px-1.5 py-0.5 text-[9px] font-black text-black">
                    <Crown className="h-2 w-2" />
                    VIP
                  </span>
                </div>
                <div className="min-w-0">
                  <SheetTitle className="truncate text-[15px] font-semibold text-white">
                    {data.user.name}
                  </SheetTitle>
                  <SheetDescription className="truncate text-xs text-[#555]">
                    {data.user.email}
                  </SheetDescription>
                </div>
              </div>

              {/* Headline */}
              <div className="rounded-2xl border border-white/[0.05] border-l-[3px] border-l-[#C3F32C] bg-[#1f1f1f] px-5 py-[18px]">
                <p className="text-xl leading-tight font-black tracking-tight text-white">
                  Vai deixar o cabelo <br />
                  na <span className="text-[#C3F32C]">régua?</span>
                </p>
                <p className="mt-1 text-xs font-medium text-[#444]">
                  Régua <span className="text-[#C3F32C]/70">Máxima.</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-2xl border border-white/[0.05] bg-[#1f1f1f] px-4 py-3">
              <div className="flex items-center gap-2">
                <CircleUser className="h-5 w-5 text-[#555]" />
                <SheetTitle className="text-sm font-normal text-[#555]">
                  Faça o seu login
                </SheetTitle>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="h-8 rounded-xl bg-[#C3F32C] text-xs font-bold text-black hover:bg-[#d4f542]"
                  >
                    <LogInIcon className="mr-1.5 h-3.5 w-3.5 text-[#  ]" />
                    <p className="text-[#254F50]">Entrar</p>
                  </Button>
                </DialogTrigger>

                <DialogContent className="border border-white/[0.05] bg-[#1c1c1c] text-white">
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      Entrar na plataforma
                    </DialogTitle>
                    <DialogDescription className="text-[#555]">
                      Escolha como deseja continuar.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="mt-3 flex flex-col gap-2">
                    {LOGIN_PROVIDERS.map(({ src, label }) => (
                      <Button
                        key={label}
                        onClick={
                          label === "Google"
                            ? handleLoginWithGoogleClick
                            : label === "GitHub"
                              ? handleLoginWithGithubClick
                              : label === "Facebook"
                                ? handleLoginWithFacebookClick
                                : undefined
                        }
                        className="w-full justify-start gap-3 rounded-xl bg-[#C3F32C] text-sm text-black hover:bg-[#d6f083]"
                      >
                        <Image src={src} alt={label} width={16} height={16} />
                        Continuar com {label}
                      </Button>
                    ))}
                  </div>
                  <h1>Login barbearia</h1>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </SheetHeader>

        {/* Separador — Header → Menu */}
        <div className="mt-6 h-px w-full bg-white/[0.05]" />

        {/* Menu */}
        <nav className="mt-6">
          <div className="mb-3 flex items-center gap-3 px-1">
            <span className="text-[10px] font-bold tracking-[0.15em] text-[#333] uppercase">
              Menu
            </span>
            <div className="h-px flex-1 bg-white/[0.05]" />
          </div>

          <div className="flex flex-col gap-0.5">
            {MENU_ITEMS.map(({ icon: Icon, label, description, href }) => (
              <Button
                key={label}
                variant="ghost"
                onClick={() => router.push(href)}
                className="group flex h-auto w-full items-center justify-between rounded-xl border border-white/[0.05] bg-[#1a1a1a] px-3.5 py-3 hover:border-white/[0.08] hover:bg-[#222]"
                
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px] border border-white/[0.05] bg-[#C3F32C]/10">
                    <Icon className="h-[17px] w-[17px] text-[#C3F32C]" />
                  </div>
                  <div className="text-left">
                    <p className="text-[14px] font-semibold text-[#eee]">
                      {label}
                    </p>
                    <p className="text-[11px] text-[#444]">{description}</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 flex-shrink-0 text-[#333] transition-all group-hover:translate-x-0.5 group-hover:text-[#C3F32C]" />
              </Button>
            ))}
          </div>
        </nav>

        {/* Logout */}
        {data?.user && (
          <div className="mt-auto border-t border-white/[0.05] pt-4 pb-6">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 rounded-xl border border-white/[0.05] tex
                  t-[#555] hover:border-red-500/20 hover:bg-transparent hover:text-red-500"
                >
                  <LogOut className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-red-500">
                    Sair da conta
                  </span>
                </Button>
              </DialogTrigger>

              <DialogContent className="border border-white/[0.05] bg-[#161616] text-white">
                <DialogHeader className="space-y-5">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
                    <LogOut className="h-6 w-6 text-red-500" />
                  </div>
                  <div className="space-y-1 text-center">
                    <DialogTitle className="text-lg font-bold text-white">
                      Sair da conta?
                    </DialogTitle>
                    <DialogDescription className="text-sm text-[#555]">
                      Sua sessão será encerrada e você precisará entrar
                      novamente.
                    </DialogDescription>
                  </div>
                  <Button
                    onClick={handleLogoutClick}
                    className="w-full rounded-xl bg-red-500 font-bold text-white hover:bg-red-600"
                  >
                    Confirmar saída
                  </Button>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

export default MenuBtn