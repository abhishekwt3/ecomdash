"use client"

import { Sun, Moon, Sunset } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {theme === "light" && <Sun className="w-5 h-5" />}
          {theme === "sepia" && <Sunset className="w-5 h-5" />}
          {theme === "dark" && <Moon className="w-5 h-5" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")} className="gap-2">
          <Sun className="w-4 h-4" />
          <span>Light</span>
          {theme === "light" && <span className="ml-auto text-primary">●</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("sepia")} className="gap-2">
          <Sunset className="w-4 h-4" />
          <span>Sepia</span>
          {theme === "sepia" && <span className="ml-auto text-primary">●</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="gap-2">
          <Moon className="w-4 h-4" />
          <span>Dark</span>
          {theme === "dark" && <span className="ml-auto text-primary">●</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
