export const DefaultScript = {
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