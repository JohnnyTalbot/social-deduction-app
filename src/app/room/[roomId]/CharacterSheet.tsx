const ScriptData = {
  'townsfolk' : [
    {
      name: 'Washerwoman',
      description: 'You start knowing that 1 of 2 players is a particular Townsfolk.'
    },
    {
      name: 'Librarian',
      description: 'You start knowing that 1 of 2 players is a particular Outsider. (Or that zero are in play.)'
    },
    {
      name: 'Investigator',
      description: 'You start knowing that 1 of 2 players is a particular Minion.'
    },
    {
      name: 'Chef',
      description: 'You start knowing how many pairs of evil players there are.'
    },
    {
      name: 'Empath',
      description: 'Each night, you learn how many of your 2 alive neighbours are evil.'
    },
    {
      name: 'Undertaker',
      description: 'Each night*, you learn which character died by execution today.'
    },
    {
      name: 'Fortune Teller',
      description: 'Each night, choose 2 players: you learn if either is a Demon. There is a good player that registers as a Demon to you.'
    },
    {
      name: 'Ravenkeeper',
      description: 'If you die at night, you are woken to choose a player: you learn their character.'
    },
    {
      name: 'Monk',
      description: 'Each night*, choose a player (not yourself): they are safe from the Demon tonight.'
    },
    {
      name: 'Slayer',
      description: 'Once per game, during the day, publicly choose a player: if they are the Demon, they die.'
    },
    {
      name: 'Virgin',
      description: 'The 1st time you are nominated, if the nominator is a Townsfolk, they are executed immediately.'
    },
    {
      name: 'Mayor',
      description: 'If only 3 players live & no execution occurs, your team wins. If you die at night, another player might die instead.'
    },
    {
      name: 'Soldier',
      description: 'You are safe from the Demon.'
    },
  ],
  'Outsider' : [
    {
      name: 'Butler',
      description: 'Each night, choose a player (not yourself): tomorrow, you may only vote if they are voting too.'
    },
    {
      name: 'Drunk',
      description: 'You do not know you are the Drunk. You think you are a Townsfolk character, but you are not.'
    },
    {
      name: 'Recluse',
      description: 'You might register as evil & as a Minion or Demon, even if dead.'
    },
    {
      name: 'Saint',
      description: 'If you die by execution, your team loses.'
    }
  ],
  'Minion' : [
    {
      name: 'Poisoner',
      description: 'Each night, choose a player: they are poisoned tonight and tomorrow day.'
    },
    {
      name: 'Spy',
      description: 'Each night, you see the Grimoire. You might register as good & as a Townsfolk or Outsider, even if dead.'
    },
    {
      name: 'Scarlet Woman',
      description: 'If there are 5 or more players alive & the Demon dies, you become the Demon. (Travellers don’t count)'
    },
    {
      name: 'Baron',
      description: 'There are extra Outsiders in play. [+2 Outsiders]'
    }
  ],
  'Demon' : [
    {
      name: 'Imp',
      description: 'Each night*, choose a player: they die. If you kill yourself this way, a Minion becomes the Imp.'
    }
  ]
}

export default function CharacterSheet() {
  return(
    <div className="w-full h-full flex flex-col pr-3 custom-scrollbar overflow-y-scroll">
      {
        Object.entries(ScriptData).map(([type, roles]) => (
          <div className="py-2" key={type}>
            <p className="text-3xl">{type}</p>
            <svg className="w-full h-[7px]"
                  viewBox="0 0 1029 7"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none">
              <path d="M1.54346 2.57666C2.25079 2.57666 3.67618 2.93032 18.9 3.46619C33.0552 3.96443 60.2953 3.64838 75.7388 3.29471C91.1823 2.94104 94.0117 2.2337 113.683 1.86932C133.355 1.50493 169.782 1.50493 189.432 1.68177C210.857 1.87457 216.917 2.57666 224.408 2.75349C229.802 2.88082 243.635 3.64838 262.202 3.82521C270.883 3.90789 282.592 4.7201 298.48 4.89693C304.468 4.96358 306.234 5.42744 315.81 5.60963C325.386 5.79182 342.716 5.79182 352.173 5.61499C361.631 5.43815 362.692 5.08449 390.295 4.90229C417.897 4.7201 472.008 4.7201 500.591 4.54327C530.593 4.35765 536.997 3.64838 545.03 3.47154C549.205 3.37963 551.68 2.57666 554.531 2.39982C555.975 2.31024 557.382 1.86932 607.093 1.68713C656.805 1.50493 754.771 1.50493 806.123 1.68177C857.474 1.8586 859.243 2.21227 887.563 2.39446C915.883 2.57666 970.702 2.57666 1027.18 2.57666" stroke="black" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <div className="flex flex-wrap w-full text-2xl">
              {roles.map((char, index) => (
                <Role key={index} name={char.name} description={char.description} />
              ))}
            </div>
          </div>
        ))
      }
    </div>
  )
}

function Role({name, description} : {name: string, description: string}){
  return(
    <span className="w-full md:w-1/2 px-2">
      <p>{name}</p>
      <p className="text-[#9247E3]">{description}</p>
    </span>
  )
}