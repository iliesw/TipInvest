/* eslint-disable @next/next/no-img-element */
import Sim from "@/components/Home/Sim"
import styled from "styled-components"

const IMG3D = styled.img`
  height:100%;
  left:50px;
  bottom:50px;
  position:relative;
  scale:1.7;
  width:auto;
`

export default function Example() {
    return (
      <div className=" py-24 sm:py-32">
        <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
          <h2 className="text-center text-base/7 font-semibold text-lime-600">Deploy faster</h2>
          <p className="mx-auto mt-2 max-w-lg text-center text-4xl font-semibold tracking-tight text-balance text-gray-950 sm:text-5xl">
            Fonctionnalités Clés de TipInvest
          </p>
          <div className="mt-10 flex gap-4 sm:mt-16">
            <div className="relative w-3/5">
              <div className="absolute inset-px  bg-white"></div>
              <div className="relative flex h-full flex-col overflow-hidden  ">
                <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                  <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center"
                  style={{fontFamily:"Figtree",fontSize:"36px",fontWeight:"1000"}}>
                  Investissement facilité
                  </p>
                  <p className="text-gray-700 mt-4">
                  Accès à un marché collaboratif avec des opportunités à haute valeur ajoutée.
                  </p>
                </div>
                <div className="@container relative min-h-[30rem] w-full grow max-lg:mx-auto max-lg:max-w-sm">
                  <div className="absolute inset-x-10 top-10 bottom-0 overflow-hidden shadow-2xl" style={{borderRadius:"55px 55px 0 0",border:"10px solid black",borderBottom:"none"}}>
                    <div style={{width:"25%",height:"28px",background:"black",position:"absolute", top:"10px",left:"50%",transform:"translate(-50%,0)",borderRadius:"100px"}}></div>
                    <img
                      className="size-full object-cover object-top"
                      src="/assets/images/Market.png"
                      alt=""
                    />
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px  ring-1 shadow-sm ring-black/5 " style={{borderRadius:"30px 10px 10px 10px"}}></div>
            </div>
            
            
            <div className="relative w-full">
              <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
                <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                  <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center" style={{fontFamily:"Figtree",fontSize:"36px",fontWeight:"1000"}}>
                  Visualisation immersive 3D
                  </p>
                  <p className="text-gray-700 mt-4">
                  Visites virtuelles et modélisation des biens.
                  </p>
                </div>
                <div className="relative min-h-[30rem] w-full grow">
                  <div className="absolute top-10 right-0 bottom-0 left-10 overflow-hidden rounded-tl-xl ">
                    <IMG3D src="/assets/images/3D.png" alt="" />
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px  ring-1 shadow-sm ring-black/5 " style={{borderRadius:"10px 30px 10px 10px"}}></div>
            </div>
          </div>
          <Sim />
        </div>
        
      </div>
    )
  }
  