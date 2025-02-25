import styled from "styled-components";

const Pan = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  .dashed {
    display: block;
    width: 80rem;
    margin: 150px 0;
    border-radius: 20px;
    outline: 2px dashed rgba(0, 0, 0, 0.153);
    padding: 55px;
    box-sizing: border-box;

    p {
      text-align: center;
      margin: 0;
      font-family: Versel;
      opacity: 0.5;
    }
  }
  .x {
    background: rgb(247, 255, 233);
    padding: 10px 20px;
    border-radius: 50px;
    font-size: 15px;
    font-family: Rubik;
    color: rgb(0, 0, 0);
  }
  h1 {
    font-family: Figtree;
    font-size: 40px;
    font-weight: 1000;
  }
`;

const StyledNbr = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;

  h1 {
    font-size: 65px;
    font-family: Figtree;
    margin: 0;
  }
`;

const Stats = () => {
  return (
    <Pan>
      <div className="dashed">
        <div
          style={{
            display: "flex",
            gap: "80px",
            paddingTop: "15px",
            alignItems: "center",
          }}
        >
          <div style={{ width: "150%" }}>
            <span className="x">Votre partenaire pour réussir</span>
            <h1
              className="animatable"
              style={{
                width: "100%",
                textAlign: "start",
                margin: 0,
                marginTop: "20px",
              }}
            >
              Déjà plus de 500 investisseurs conquis !
            </h1>
          </div>
          <p
            className="animatable"
            style={{ width: "120%", height: "100%", textAlign: "start" }}
          >
            Notre plateforme est conçue pour connecter les utilisateurs à leurs 
            biens idéaux rapidement, offrant une expérience fluide et engageante. 
            Pour les investisseurs, nous offrons une forte croissance, des ventes plus rapides 
            et un retour sur investissement croissant, faisant de notre plateforme 
            une opportunité idéale sur le marché immobilier.
          </p>
        </div>

        <div
          style={{
            margin: "30px 0",
            marginBottom: "40px",
            width: "100%",
            height: "1px",
            background:
              "linear-gradient(90deg,rgba(0, 0, 0, 0.253) 50%,white 50%)",
            display: "block",
            backgroundSize: "5px",
          }}
        ></div>

        <div style={{ display: "flex", gap: "40px" }}>
          <StyledNbr>
            <h1>50+</h1>
            <p>
              Biens listés – Un large éventail de maisons, appartements et espaces commerciaux.
            </p>
          </StyledNbr>
          <StyledNbr>
            <h1>150%</h1>
            <p>
              Croissance annuelle – Démontrant la popularité croissante de la plateforme 
              et l&apos;augmentation de sa part de marché.
            </p>
          </StyledNbr>
          <StyledNbr>
            <h1>30%</h1>
            <p>
              Augmentation du ROI – Les investisseurs bénéficient de rendements plus élevés 
              grâce à nos analyses de données et transactions rapides.
            </p>
          </StyledNbr>
        </div>
      </div>
    </Pan>
  );
};

export default Stats;
