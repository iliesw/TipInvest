/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import styled from "styled-components";

const IntoDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom:80px;
  div {
    width: 65vw;
    height: 35vh;
    background: linear-gradient( 0deg ,#008e26 -200%, white);
    border-radius: 10px;
    overflow:visible;
    display:flex;
    position:relative;
    
  }

  img{
    height:70vh;
    position:absolute;
    bottom:0;
  }

  .right{
    width:90%;
    height:170%;
    left:-25%;
  }
  .left{
    /* width:100%; */
    height:200%;
    left:65%;
    z-index:0;
    mask-image:linear-gradient(0deg,black,#00000080);
  }
`;

const Into = () => {
  return (
    <IntoDiv>
      <div>

      <img className="right" src="/assets/images/right.png"/>
      <img className="left" src="/assets/images/left.png"/>
      </div>
    </IntoDiv>
  );
};

export default Into;
