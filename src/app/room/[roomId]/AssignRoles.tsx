import Image from 'next/image';
import { Card } from '@/components/ui/Card';

import { Script } from '@/types/game';

interface AssignRolesProps{
  script: Script;
}

function AssignRoles({script} : AssignRolesProps){
  return(
    <div className="w-full h-full flex flex-col pr-3 custom-scrollbar overflow-y-scroll">
      {Object.entries(script.roleList).map(([type, value]) => (
        <div className="py-2" key={type}>
          <p className="text-3xl">{type}</p>
          <svg className="w-full h-[7px]"
                viewBox="0 0 1029 7"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none">
            <path d="M1.54346 2.57666C2.25079 2.57666 3.67618 2.93032 18.9 3.46619C33.0552 3.96443 60.2953 3.64838 75.7388 3.29471C91.1823 2.94104 94.0117 2.2337 113.683 1.86932C133.355 1.50493 169.782 1.50493 189.432 1.68177C210.857 1.87457 216.917 2.57666 224.408 2.75349C229.802 2.88082 243.635 3.64838 262.202 3.82521C270.883 3.90789 282.592 4.7201 298.48 4.89693C304.468 4.96358 306.234 5.42744 315.81 5.60963C325.386 5.79182 342.716 5.79182 352.173 5.61499C361.631 5.43815 362.692 5.08449 390.295 4.90229C417.897 4.7201 472.008 4.7201 500.591 4.54327C530.593 4.35765 536.997 3.64838 545.03 3.47154C549.205 3.37963 551.68 2.57666 554.531 2.39982C555.975 2.31024 557.382 1.86932 607.093 1.68713C656.805 1.50493 754.771 1.50493 806.123 1.68177C857.474 1.8586 859.243 2.21227 887.563 2.39446C915.883 2.57666 970.702 2.57666 1027.18 2.57666" stroke="black" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <div className="flex flex-wrap w-full text-2xl gap-5 p-5">
            {value.roles.map((char, index) => (
              <Card 
                key={index}
                className="flex flex-col justify-center items-center w-[120px] h-[120px]"
                bgColor={value.color}
                padding="5px"
                >
                <Image 
                  width={75} 
                  height={75} 
                  alt={`${char.name}`} 
                  src={`/assets/${char.name.toLowerCase()}.png`} 
                />
                <p className="text-lg text-center text-black">{char.name}</p>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default AssignRoles;