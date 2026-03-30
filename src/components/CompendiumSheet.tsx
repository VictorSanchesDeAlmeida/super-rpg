'use client';

import races from '@/data/dnd/races.json';
import classes from '@/data/dnd/classes.json';
import skills from '@/data/dnd/skills.json';
import weapons from '@/data/dnd/weapons.json';
import { DndClass, DndRace, DndSkill, DndWeapon } from '@/types/dnd';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const dndRaces = races as DndRace[];
const dndClasses = classes as DndClass[];
const dndSkills = skills as DndSkill[];
const dndWeapons = weapons as DndWeapon[];

function CompendiumCard({ children }: { children: React.ReactNode }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-slate-50 p-3 shadow-sm">
      {children}
    </article>
  );
}

export function CompendiumSheet() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-white border-gray-600 hover:bg-gray-700">
          Compendio D&D
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl w-[95vw]">
        <DialogHeader>
          <DialogTitle>Compendio D&D 5e</DialogTitle>
          <DialogDescription>
            Visualize classes, racas, pericias e armas disponiveis com descricoes em portugues.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="races" className="mt-2">
          <TabsList>
            <TabsTrigger value="races">Racas</TabsTrigger>
            <TabsTrigger value="classes">Classes</TabsTrigger>
            <TabsTrigger value="skills">Pericias</TabsTrigger>
            <TabsTrigger value="weapons">Armas</TabsTrigger>
          </TabsList>

          <div className="max-h-[72vh] overflow-y-auto pr-1">
            <TabsContent value="classes">
              <div className="grid gap-3 sm:grid-cols-2">
                {dndClasses.map((characterClass) => (
                  <CompendiumCard key={characterClass.id}>
                  <p className="text-sm font-medium text-gray-900">{characterClass.name}</p>
                  <p className="text-xs text-gray-600 mt-1">{characterClass.description}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Dado de vida: {characterClass.hitDie} | Atributo principal: {characterClass.primaryAbility.join(', ')}
                  </p>
                  </CompendiumCard>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="races">
              <div className="grid gap-3 sm:grid-cols-2">
                {dndRaces.map((race) => (
                  <CompendiumCard key={race.id}>
                  <p className="text-sm font-medium text-gray-900">{race.name}</p>
                  <p className="text-xs text-gray-600 mt-1">{race.description}</p>
                  <p className="text-xs text-gray-500 mt-2">Deslocamento: {race.speed} pes</p>
                  </CompendiumCard>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="skills">
              <div className="grid gap-3 sm:grid-cols-2">
                {dndSkills.map((skill) => (
                  <CompendiumCard key={skill.id}>
                  <p className="text-sm font-medium text-gray-900">{skill.name}</p>
                  <p className="text-xs text-gray-600 mt-1">{skill.description}</p>
                  <p className="text-xs text-gray-500 mt-2">Atributo base: {skill.ability}</p>
                  </CompendiumCard>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="weapons">
              <div className="grid gap-3 sm:grid-cols-2">
                {dndWeapons.map((weapon) => (
                  <CompendiumCard key={weapon.id}>
                  <p className="text-sm font-medium text-gray-900">{weapon.name}</p>
                  <p className="text-xs text-gray-600 mt-1">{weapon.description}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Categoria: {weapon.category} | Dano: {weapon.damage} ({weapon.damageType})
                  </p>
                  </CompendiumCard>
                ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
