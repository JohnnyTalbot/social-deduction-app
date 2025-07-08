import { Script, RoleType, Role } from '@/types/game';

export const TroubleBrewing : Script = {
  name: 'trouble brewing',
  minimum: 5,
  numberTable: {
    5: [3, 0, 1, 1],
    6: [3, 1, 1, 1],
    7: [5, 0, 1, 1],
    8: [5, 1, 1, 1],
    9: [5, 2, 1, 1],
    10: [7, 0, 2, 1],
    11: [7, 1, 2, 1],
    12: [7, 2, 2, 1],
    13: [9, 0, 3, 1],
    14: [9, 1, 3, 1],
    15: [9, 2, 3, 1],
  },
  roleList: {
    'Townsfolk' : { 
      name: 'townsfolk',
      color: '#445EE0',
      roles : [
        {
          name: 'Washerwoman',
          type: 'townsfolk',
          description: 'You start knowing that 1 of 2 players is a particular Townsfolk.'
        },
        {
          name: 'Librarian',
          type: 'townsfolk',
          description: 'You start knowing that 1 of 2 players is a particular Outsider. (Or that zero are in play.)'
        },
        {
          name: 'Investigator',
          type: 'townsfolk',
          description: 'You start knowing that 1 of 2 players is a particular Minion.'
        },
        {
          name: 'Chef',
          type: 'townsfolk',
          description: 'You start knowing how many pairs of evil players there are.'
        },
        {
          name: 'Empath',
          type: 'townsfolk',
          description: 'Each night, you learn how many of your 2 alive neighbours are evil.'
        },
        {
          name: 'Undertaker',
          type: 'townsfolk',
          description: 'Each night*, you learn which character died by execution today.'
        },
        {
          name: 'Fortune Teller',
          type: 'townsfolk',
          description: 'Each night, choose 2 players: you learn if either is a Demon. There is a good player that registers as a Demon to you.'
        },
        {
          name: 'Ravenkeeper',
          type: 'townsfolk',
          description: 'If you die at night, you are woken to choose a player: you learn their character.'
        },
        {
          name: 'Monk',
          type: 'townsfolk',
          description: 'Each night*, choose a player (not yourself): they are safe from the Demon tonight.'
        },
        {
          name: 'Slayer',
          type: 'townsfolk',
          description: 'Once per game, during the day, publicly choose a player: if they are the Demon, they die.'
        },
        {
          name: 'Virgin',
          type: 'townsfolk',
          description: 'The 1st time you are nominated, if the nominator is a Townsfolk, they are executed immediately.'
        },
        {
          name: 'Mayor',
          type: 'townsfolk',
          description: 'If only 3 players live & no execution occurs, your team wins. If you die at night, another player might die instead.'
        },
        {
          name: 'Soldier',
          type: 'townsfolk',
          description: 'You are safe from the Demon.'
        },
      ]
    },
    'Outsider' : 
      { 
        name: 'outsider',
        color: '#68B5EF',
        roles: [
          {
            name: 'Butler',
            type: 'outsider',
            description: 'Each night, choose a player (not yourself): tomorrow, you may only vote if they are voting too.'
          },
          {
            name: 'Drunk',
            type: 'outsider',
            description: 'You do not know you are the Drunk. You think you are a Townsfolk character, but you are not.'
          },
          {
            name: 'Recluse',
            type: 'outsider',
            description: 'You might register as evil & as a Minion or Demon, even if dead.'
          },
          {
            name: 'Saint',
            type: 'outsider',
            description: 'If you die by execution, your team loses.'
          }
        ]
      },
    'Minion' : {
      name: 'minion',
      color: '#FA8343',
      roles: [
        {
          name: 'Poisoner',
          type: 'minion',
          description: 'Each night, choose a player: they are poisoned tonight and tomorrow day.'
        },
        {
          name: 'Spy',
          type: 'minion',
          description: 'Each night, you see the Grimoire. You might register as good & as a Townsfolk or Outsider, even if dead.'
        },
        {
          name: 'Scarlet Woman',
          type: 'minion',
          description: 'If there are 5 or more players alive & the Demon dies, you become the Demon. (Travellers don’t count)'
        },
        {
          name: 'Baron',
          type: 'minion',
          description: 'There are extra Outsiders in play. [+2 Outsiders]'
        }
      ]
    },
    'Demon' : {
      name: 'demon',
      color: '#D94343',
      roles: [
        {
          name: 'Imp',
          type: 'demon',
          description: 'Each night*, choose a player: they die. If you kill yourself this way, a Minion becomes the Imp.'
        }
      ]
    }
  }
}