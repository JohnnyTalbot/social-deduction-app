import Image from 'next/image';
import { useState, useEffect } from 'react';

import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Tooltip } from '@/components/Tooltip';

import { Script, Role, Room, Player } from '@/types/game';

interface AssignRolesProps{
  script: Script;
  selectedRoles: Role[];
  setSelectedRoles: (roles: Role[]) => void;
  updatePlayerById: (playerId: string, partial: Partial<Player>) => void;
  playerList: Player[];
  totalPlayers: number;
}

function AssignRoles({script, selectedRoles, setSelectedRoles, updatePlayerById, playerList, totalPlayers} : AssignRolesProps){
  const [isEnough, setIsEnough] = useState(false)

  const [tooltip, setTooltip] = useState({
    x: 0,
    y: 0,
    content: '',
    visible: false
  });

  useEffect(() => {
    setIsEnough(totalPlayers >= script.minimum)

    if(!isEnough){
      setSelectedRoles([])
    }
  }, [totalPlayers])
  

  const handleMouseMove = (e: React.MouseEvent, content: string) => {
    setTooltip({
      x: e.clientX,
      y: e.clientY,
      content,
      visible: true
    });
  };

  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  const toggleRoleSelect = (role: Role) => {
    if(!isEnough) return;

    const isSelected = selectedRoles.some(r => r.name === role.name);

    if (isSelected) {
      setSelectedRoles(selectedRoles.filter(r => r.name !== role.name));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const shuffleRoles = () => {
    if (!isEnough || !script.numberTable[totalPlayers]) return;

    const countsPerType = script.numberTable[totalPlayers];
    const roleTypes = Object.keys(script.roleList);

    const newSelected: Role[] = [];

    roleTypes.forEach((type, index) => {
      const requiredCount = countsPerType[index];
      const available = script.roleList[
        capitalize(type)
      ]?.roles ?? [];

      const shuffled = [...available].sort(() => Math.random() - 0.5);

      newSelected.push(...shuffled.slice(0, requiredCount));
    });

    setSelectedRoles(newSelected);
  };

  const assignRoles = () => {
    if (selectedRoles.length > totalPlayers) {
      alert("You have selected more roles than there are players.");
      return;
    }

    // Shuffle roles and players
    const shuffledRoles = [...selectedRoles].sort(() => Math.random() - 0.5);
    const shuffledPlayers = [...playerList].sort(() => Math.random() - 0.5);

    // Assign roles to the first N players
    shuffledPlayers.forEach((player, index) => {
      const role = shuffledRoles[index];

      if (role) {
        updatePlayerById(player.id, { role: role.name });
      } else {
        // If no role is assigned, clear any existing role
        updatePlayerById(player.id, { role: '' });
      }
    });
  };



  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);


  return(
    <div className="w-full h-full flex flex-col">
    <div className="w-full h-full flex flex-col pr-3 custom-scrollbar overflow-y-scroll">
      <div className='flex flex-row gap-3'>
        <p className="text-3xl text-[#9247E3]">Total Players : {totalPlayers}</p>
        {!isEnough && <p className="text-3xl text-warning">Not enough players!</p>}
      </div>
      {Object.entries(script.roleList).map(([type, value], index) => (
        <div className="py-2" key={type}>
          <div className='flex flex-row gap-5'>
            <p className="text-3xl">{type}</p>
            <p className="text-3xl">{selectedRoles.filter(r => r.type == type.toLowerCase()).length} / {isEnough && script.numberTable[totalPlayers] ? script.numberTable[totalPlayers][index] : 0}</p>
          </div>
          <svg className="w-full h-[7px]"
                viewBox="0 0 1029 7"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none">
            <path d="M1.54346 2.57666C2.25079 2.57666 3.67618 2.93032 18.9 3.46619C33.0552 3.96443 60.2953 3.64838 75.7388 3.29471C91.1823 2.94104 94.0117 2.2337 113.683 1.86932C133.355 1.50493 169.782 1.50493 189.432 1.68177C210.857 1.87457 216.917 2.57666 224.408 2.75349C229.802 2.88082 243.635 3.64838 262.202 3.82521C270.883 3.90789 282.592 4.7201 298.48 4.89693C304.468 4.96358 306.234 5.42744 315.81 5.60963C325.386 5.79182 342.716 5.79182 352.173 5.61499C361.631 5.43815 362.692 5.08449 390.295 4.90229C417.897 4.7201 472.008 4.7201 500.591 4.54327C530.593 4.35765 536.997 3.64838 545.03 3.47154C549.205 3.37963 551.68 2.57666 554.531 2.39982C555.975 2.31024 557.382 1.86932 607.093 1.68713C656.805 1.50493 754.771 1.50493 806.123 1.68177C857.474 1.8586 859.243 2.21227 887.563 2.39446C915.883 2.57666 970.702 2.57666 1027.18 2.57666" stroke="black" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <div className="flex flex-wrap w-full text-2xl gap-5 p-5">
            {value.roles.map((role, index) => (
              <Card
                key={index}
                onMouseMove={(e) => handleMouseMove(e,( role.description || ''))}
                onMouseLeave={handleMouseLeave}
                onClick={() => toggleRoleSelect(role)}
                className={`flex flex-col justify-center items-center w-[120px] h-[120px] p-1 relative cursor-pointer ${selectedRoles.some(r => r.name === role.name) ? '' : 'opacity-50'}`}
                bgColor={value.color}
              >
                <Image
                  width={75}
                  height={75}
                  alt={`${role.name}`}
                  src={`/assets/${role.name.toLowerCase()}.png`}
                />
                <p className="text-lg text-center text-black">{role.name}</p>
              </Card>
            ))}
            <Tooltip x={tooltip.x} y={tooltip.y} content={tooltip.content} visible={tooltip.visible} />
          </div>
        </div>
      ))}
    </div>
      <div className='w-full flex flex-row justify-center items-center gap-5 pt-2'>
        <Button 
          className='flex flex-row text-3xl justify-cemter items-center gap-2'
          onClick={assignRoles}>
          <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M14 12C17.3137 12 20 9.31371 20 6C20 2.68629 17.3137 0 14 0C10.6863 0 8 2.68629 8 6C8 9.31371 10.6863 12 14 12ZM14 9C15.6569 9 17 7.65685 17 6C17 4.34315 15.6569 3 14 3C12.3431 3 11 4.34315 11 6C11 7.65685 12.3431 9 14 9Z" fill="white"/>
            <path d="M2.52565 20.1523C4.55788 17.1856 8.18122 15 14.0007 15C15.84 15 17.4674 15.2172 18.9016 15.6161C19.6998 15.8381 20.1668 16.6651 19.9449 17.4632C19.7229 18.2613 18.8959 18.7284 18.0978 18.5064C16.9579 18.1894 15.6045 18 14.0007 18C9.0201 18 6.39344 19.8144 5.00066 21.8477C3.87897 23.4852 3.45948 25.4093 3.4255 27H16.9997C17.8281 27 18.4997 27.6716 18.4997 28.5C18.4997 29.3284 17.8281 30 16.9997 30H2.00066C1.24417 30 0.606072 29.4367 0.512242 28.6861C0.229177 26.4215 0.555785 23.028 2.52565 20.1523Z" fill="white"/>
            <path d="M24.5 30C23.6716 30 23 29.3284 23 28.5V25.5H20C19.1716 25.5 18.5 24.8284 18.5 24C18.5 23.1716 19.1716 22.5 20 22.5H23V19.5C23 18.6716 23.6716 18 24.5 18C25.3284 18 26 18.6716 26 19.5V22.5H29C29.8284 22.5 30.5 23.1716 30.5 24C30.5 24.8284 29.8284 25.5 29 25.5H26V28.5C26 29.3284 25.3284 30 24.5 30Z" fill="white"/>
          </svg>
          Assign Roles 
        </Button>
        <Button 
          className='flex flex-row text-3xl justify-cemter items-center gap-2'
          onClick={shuffleRoles}>
          <svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M18.4021 0.43934C18.9428 -0.101386 19.7936 -0.14298 20.3821 0.314557L24.6607 4.5932C25.0801 5.1326 25.0801 5.8925 24.6607 6.4319L20.3821 10.7105C19.8427 11.13 18.9175 11.1012 18.4021 10.5858C17.8866 10.0703 17.8579 9.14516 18.2773 8.60576L19.8102 7.05362C18.0031 7.08279 15.9089 8.34591 13.5277 10.843L13.0555 11.358L12.4414 12.0614C11.9569 12.6257 11.9591 13.4597 12.4464 14.0215L13.5123 15.2353C15.9237 17.7618 18.0491 19.0332 19.8884 19.0496L18.2773 17.4193C17.8198 16.8309 17.8613 15.9801 18.4021 15.4393C18.9428 14.8986 19.7936 14.857 20.3821 15.3146L24.6607 19.5932C25.0801 20.1326 25.0801 20.8925 24.6607 21.4319L20.3821 25.7105C19.8427 26.13 18.9189 26.1025 18.4021 25.5858C17.8853 25.069 17.8579 24.1452 18.2773 23.6058L19.818 22.047L19.5561 22.0439C15.3665 21.9237 11.6051 19.4448 9.86704 15.8573C8.0745 19.5932 4.79885 22.0522 1.5 22.0522C0.671573 22.0522 0 21.3806 0 20.5522C0 19.7238 0.671573 19.0522 1.5 19.0522C3.68633 19.0522 5.12592 17.7671 7.40705 14.1336L7.84215 13.4272C7.98548 13.1945 7.99089 12.9023 7.85627 12.6644L7.40705 11.8708C5.06825 8.13321 3.60824 7.05 1.5 7.05C0.671573 7.05 0 6.37843 0 5.55C0 4.72157 0.671573 4.05 1.5 4.05C5.0348 4.05 7.09908 5.86461 9.86767 10.2462C12.7383 6.08569 15.3633 4.18089 19.5483 4.05853L19.893 4.053L18.2773 2.41935C17.8198 1.83091 17.8613 0.980066 18.4021 0.43934Z" fill="white"/>
          </svg>
          Shuffle Roles
        </Button>
      </div>
    </div>
  )
}

export default AssignRoles;