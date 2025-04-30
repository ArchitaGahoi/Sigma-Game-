import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Sigma Games</h1>
        <p className="mt-4 text-xl text-muted-foreground">Play your favorite classic games online</p>
      </header>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <GameCard
          title="Chess"
          image="/chess.png?height=300&width=400"
          description="Challenge our AI in a strategic game of chess"
          href="/games/chess"
        />
        <GameCard
          title="Pacman"
          image="/pacman.jpg?height=300&width=400"
          description="Navigate through the maze and eat all the dots"
          href="/games/pacman"
        />
        <GameCard
          title="Snake"
          image="/snake.png?height=300&width=400"
          description="Grow your snake by eating food without hitting the walls or yourself"
          href="/games/snake"
        />
      </div>
    </div>
  )
}

interface GameCardProps {
  title: string
  image: string
  description: string
  href: string
}

function GameCard({ title, image, description, href }: GameCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="aspect-video overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={`${title} game`}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardContent className="p-6">
        <h2 className="mb-2 text-2xl font-bold">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Link href={href} className="w-full">
          <Button className="w-full">Play Now</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
