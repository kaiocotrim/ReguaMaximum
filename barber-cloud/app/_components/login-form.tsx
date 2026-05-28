// import { cn } from "@/app/_lib/utils"
// import { Button } from "@/app/_components/ui/button"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/app/_components/ui/card"
// import {
//   Field,
//   FieldDescription,
//   FieldGroup,
//   FieldLabel,
// } from "@/app/_components/ui/field"
// import { LoginProviders } from "@/app/_components/LoginProviders"
// import { Input } from "@/app/_components/ui/input"

// export function LoginForm({
//   className,
//   ...props
// }: React.ComponentProps<"div">) {
//   return (
//     <div className={cn} {...props}>
//       <Card className="bg-[#161616] shadow-none border-0">
//         <CardHeader>
//           <CardTitle>Entre na sua conta</CardTitle>
//           <CardDescription>Insira seu e-mail abaixo para acessar</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form>
//             <FieldGroup>
//               <Field>
//                 <FieldLabel htmlFor="email">E-mail</FieldLabel>
//                 <Input id="email" type="email" placeholder="m@exemplo.com" required />
//               </Field>
//               <Field>
//                 <div className="flex items-center">
//                   <FieldLabel htmlFor="password">Senha</FieldLabel>
//                   <a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
//                     Esqueceu a senha?
//                   </a>
//                 </div>
//                 <Input id="password" type="password" required />
//               </Field>
//               <Field>
//                 <Button type="submit">Entrar</Button>
//                 <FieldDescription className="text-center">
//                   Não tem uma conta? <a href="#">Cadastre-se</a>
//                 </FieldDescription>
//               </Field>
//             </FieldGroup>
//           </form>
//           <LoginProviders />
//         </CardContent>  
//       </Card>
//     </div>
//   )
// }

import { cn } from "@/app/_lib/utils"
import { Button } from "@/app/_components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/app/_components/ui/field"
import { LoginProviders } from "@/app/_components/LoginProviders"
import { Input } from "@/app/_components/ui/input"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    // 1. Definição de largura ideal e correção do utilitário 'cn'
    <div className={cn("w-full", className)} {...props}>
      {/* 2. Adicionado uma borda sutil e cantos mais arredondados para destacar o card no fundo escuro */}
      <Card className="bg-[#161616] border border-zinc-800/80 rounded-xl shadow-2xl backdrop-blur-sm">
        {/* 3. Cabeçalho centralizado com melhor espaçamento e tipografia */}
        <CardHeader className="space-y-1.5 text-center pt-8 pb-6">
          <CardTitle className="text-2xl font-semibold tracking-tight text-zinc-100">
            Entre na sua conta
          </CardTitle>
          <CardDescription className="text-sm text-zinc-400">
            Insira seu e-mail abaixo para acessar
          </CardDescription>
        </CardHeader>
        
        <CardContent className="grid gap-6 px-6 pb-8">
          <form className="space-y-4">
            <FieldGroup className="space-y-4">
              <Field className="space-y-1.5">
                <FieldLabel htmlFor="email" className="text-zinc-300 font-medium text-sm">
                  E-mail
                </FieldLabel>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="m@exemplo.com" 
                  required 
                  className="bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-zinc-700"
                />
              </Field>
              
              <Field className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password" className="text-zinc-300 font-medium text-sm">
                    Senha
                  </FieldLabel>
                  {/* 4. Link de "Esqueceu a senha" mais discreto e elegante */}
                  <a 
                    href="#" 
                    className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors underline-offset-4 hover:underline"
                  >
                    Esqueceu a senha?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  className="bg-zinc-900/50 border-zinc-800 text-zinc-100 focus-visible:ring-zinc-700"
                />
              </Field>
            </FieldGroup>

            {/* 5. Botão de Call to Action (CTA) robusto ocupando a largura total */}
            <Button type="submit" className="w-full mt-2 font-medium tracking-wide">
              Entrar
            </Button>
          </form>

          {/* 6. Divisor visual sutil para os provedores de login social */}
          <div className="relative flex items-center py-1">
            <div className="flex-grow border-t border-zinc-800/80"></div>
            <span className="flex-shrink mx-3 text-[10px] uppercase tracking-widest text-zinc-500 font-medium">
              Ou continue com
            </span>
            <div className="flex-grow border-t border-zinc-800/80"></div>
          </div>

          <LoginProviders />

          {/* 7. Footer com melhor hierarquia de cores fora do fluxo do form */}
          <p className="text-center text-xs text-zinc-400 mt-2">
            Não tem uma conta?{" "}
            <a 
              href="#" 
              className="font-medium text-zinc-200 hover:text-white underline-offset-4 hover:underline transition-colors"
            >
              Cadastre-se
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}