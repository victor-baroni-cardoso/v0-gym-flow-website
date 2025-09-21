"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Check, Star, Zap, Clock, Brain, TrendingUp, Award, Sparkles, Smartphone } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"

export function PlansTab() {
  const [isYearly, setIsYearly] = useState(false)
  const { user, upgradeToPremium, downgradeToBasic } = useAuth()
  const { toast } = useToast()

  const basicFeatures = [
    { icon: TrendingUp, text: "Planejamento de treinos", description: "Crie e organize seus treinos" },
    { icon: Clock, text: "Histórico de sessões", description: "Acompanhe seu progresso" },
    { icon: Award, text: "Timeline de fotos", description: "Documente sua evolução" },
    { icon: Check, text: "Checklist semanal", description: "Metas e objetivos semanais" },
  ]

  const premiumFeatures = [
    { icon: Check, text: "Tudo do Plano Básico", description: "Todas as funcionalidades gratuitas" },
    { icon: TrendingUp, text: "Controle de Dieta", description: "Planejamento nutricional completo" },
    { icon: Brain, text: "FitIA Mentor (IA Assistente)", description: "Assistente inteligente personalizado" },
    {
      icon: Smartphone,
      text: "Sincronização de Apps de Saúde",
      description: "Samsung Health, Apple Saúde e Google Fit",
    },
    { icon: Sparkles, text: "Planos personalizados", description: "Treinos adaptados ao seu perfil" },
    { icon: Award, text: "Análises avançadas", description: "Relatórios detalhados de performance" },
    { icon: Star, text: "Futuramente +", description: "Novas funcionalidades em desenvolvimento" },
  ]

  const monthlyPrice = 23.9
  const yearlyPrice = monthlyPrice * 12 * 0.8 // 20% discount

  const handleUpgrade = () => {
    upgradeToPremium()
    toast({
      title: "Plano atualizado!",
      description: "Bem-vindo ao Plano Maromba! Agora você tem acesso às abas Dieta, Saúde e FitIA Mentor.",
    })
  }

  const handleDowngrade = () => {
    downgradeToBasic()
    toast({
      title: "Plano alterado",
      description: "Você voltou para o Plano Básico.",
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold font-[family-name:var(--font-heading)] bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Escolha seu Plano
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Encontre o plano perfeito para seus objetivos fitness e transforme sua jornada na academia
        </p>

        {user && (
          <div className="flex items-center justify-center gap-2">
            <Badge variant={user.plan === "premium" ? "default" : "secondary"} className="text-sm">
              Plano Atual: {user.plan === "premium" ? "Maromba" : "Básico"}
            </Badge>
          </div>
        )}

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 p-1 bg-muted rounded-lg w-fit mx-auto">
          <span className={`text-sm font-medium ${!isYearly ? "text-foreground" : "text-muted-foreground"}`}>
            Mensal
          </span>
          <Switch checked={isYearly} onCheckedChange={setIsYearly} />
          <span className={`text-sm font-medium ${isYearly ? "text-foreground" : "text-muted-foreground"}`}>Anual</span>
          {isYearly && (
            <Badge variant="secondary" className="ml-2">
              20% OFF
            </Badge>
          )}
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Basic Plan */}
        <Card
          className={`relative border-2 hover:shadow-xl transition-all duration-300 ${user?.plan === "basic" ? "border-primary" : ""}`}
        >
          <CardHeader className="text-center pb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <Star className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl mb-2">Plano Básico</CardTitle>
            <div className="space-y-2">
              <div className="text-5xl font-bold text-primary">Grátis</div>
              <CardDescription className="text-base">Para sempre • Sem compromisso</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <ul className="space-y-4">
              {basicFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="p-1 bg-primary/10 rounded-full mt-0.5">
                    <feature.icon className="h-4 w-4 text-primary flex-shrink-0" />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium">{feature.text}</span>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </li>
              ))}
            </ul>
            {user?.plan === "premium" ? (
              <Button
                variant="outline"
                className="w-full h-12 text-base font-medium bg-transparent"
                onClick={handleDowngrade}
              >
                Voltar para Básico
              </Button>
            ) : (
              <Button
                variant="outline"
                className="w-full h-12 text-base font-medium bg-transparent hover:bg-primary/5"
                disabled
              >
                Plano Atual
              </Button>
            )}
            <p className="text-xs text-center text-muted-foreground">Sem cartão de crédito • Ativação imediata</p>
          </CardContent>
        </Card>

        {/* Premium Plan */}
        <Card
          className={`relative border-2 shadow-2xl scale-105 lg:scale-110 ${user?.plan === "premium" ? "border-secondary" : "border-secondary"}`}
        >
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-gradient-to-r from-secondary to-secondary/80 text-white px-4 py-2 text-sm font-semibold">
              🔥 Mais Popular
            </Badge>
          </div>
          <CardHeader className="text-center pb-8 pt-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="p-2 bg-secondary/10 rounded-full">
                <Zap className="h-6 w-6 text-secondary" />
              </div>
            </div>
            <CardTitle className="text-2xl mb-2">Plano Maromba</CardTitle>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <span className="text-5xl font-bold text-secondary">
                  R$ {isYearly ? Math.round(yearlyPrice / 12).toFixed(0) : monthlyPrice.toFixed(0)}
                </span>
                <div className="text-left">
                  <div className="text-sm text-muted-foreground">,90</div>
                  <div className="text-sm text-muted-foreground">/{isYearly ? "mês" : "mês"}</div>
                </div>
              </div>
              {isYearly && (
                <div className="text-sm text-muted-foreground">
                  <span className="line-through">R$ {(monthlyPrice * 12).toFixed(0)}</span>
                  <span className="ml-2 text-secondary font-medium">R$ {yearlyPrice.toFixed(0)} por ano</span>
                </div>
              )}
              <CardDescription className="text-base">
                {isYearly ? "Cobrado anualmente" : "Cobrado mensalmente"} • Cancele quando quiser
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <ul className="space-y-4">
              {premiumFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="p-1 bg-secondary/10 rounded-full mt-0.5">
                    <feature.icon className="h-4 w-4 text-secondary flex-shrink-0" />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium">{feature.text}</span>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </li>
              ))}
            </ul>
            {user?.plan === "premium" ? (
              <Button
                className="w-full h-12 text-base font-medium bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary text-white"
                disabled
              >
                Plano Atual
              </Button>
            ) : (
              <Button
                className="w-full h-12 text-base font-medium bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary text-white"
                onClick={handleUpgrade}
              >
                Assinar Agora
              </Button>
            )}
            <p className="text-xs text-center text-muted-foreground">
              Teste grátis por 7 dias • Cancele a qualquer momento
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Features Comparison */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Compare os Planos</CardTitle>
          <CardDescription>Veja todas as funcionalidades lado a lado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-2">Funcionalidades</th>
                  <th className="text-center py-4 px-2">Básico</th>
                  <th className="text-center py-4 px-2">Maromba</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                {[
                  "Planejamento de treinos",
                  "Histórico de sessões",
                  "Timeline de fotos",
                  "Checklist semanal",
                  "Controle de dieta",
                  "IA Assistente",
                  "Sincronização de apps de saúde",
                  "Planos personalizados",
                  "Análises avançadas",
                  "Suporte prioritário",
                ].map((feature, index) => (
                  <tr key={index} className="border-b border-border/50">
                    <td className="py-3 px-2 font-medium">{feature}</td>
                    <td className="text-center py-3 px-2">
                      {index < 4 ? (
                        <Check className="h-5 w-5 text-primary mx-auto" />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="text-center py-3 px-2">
                      <Check className="h-5 w-5 text-secondary mx-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Testimonials */}
      <div className="max-w-4xl mx-auto space-y-6">
        <h3 className="text-2xl font-bold text-center">O que nossos usuários dizem</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              name: "Carlos Silva",
              role: "Atleta Amador",
              content: "O Gym Flow revolucionou meus treinos. A IA me ajuda a otimizar cada sessão!",
              rating: 5,
            },
            {
              name: "Ana Costa",
              role: "Personal Trainer",
              content: "Uso com meus alunos. A timeline de fotos é perfeita para acompanhar a evolução.",
              rating: 5,
            },
          ].map((testimonial, index) => (
            <Card key={index} className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="flex mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                  ))}
                </div>
                <p className="text-sm mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-medium text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Perguntas Frequentes</CardTitle>
          <CardDescription>Tire suas dúvidas sobre os planos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Posso cancelar a qualquer momento?</h4>
              <p className="text-sm text-muted-foreground">
                Sim, você pode cancelar sua assinatura a qualquer momento sem taxas adicionais.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Como funciona o teste grátis?</h4>
              <p className="text-sm text-muted-foreground">
                Você tem 7 dias para testar todas as funcionalidades premium sem compromisso.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Meus dados ficam seguros?</h4>
              <p className="text-sm text-muted-foreground">
                Sim, todos os seus dados são criptografados e armazenados com segurança.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
