import { useState } from 'react';
import "./styles.css";

import TableItem from '../../components/TableItem';

function App() {
  const [previewImg, setPreviewImg] = useState();
  const [previewImgB, setPreviewImgB] = useState();

  const [previewCompared, setPreviewCompared] = useState();
  const [compareDataResult, setCompareDataResult] = useState();

  const [sliderValue, setSliderValue] = useState(10);

  const handleFile = (e) => {
    let content = e.target.result;
    content = content.split(/\r\n|\n/);
    const [ col, lin ] = content[2].split(' ');
    content.splice(0, 3);

    const table = {
      id: e.timeStamp,
      data: content,
      column: col,
      line: lin,
    }

    if(e.target.id === 'orig'){
      setPreviewImg(table);
    } else if(e.target.id === 'comp'){
      setPreviewImgB(table);
    }
  }
  
  const handleChangeFile = (file, image) => {
    if(!file){
      
      return
    }
    let fileData = new FileReader();
    fileData.id = image
    fileData.onloadend = handleFile;
    fileData.readAsText(file);
  }


  const compareImages = ((param) => {

    if(!previewImg || !previewImgB){
      alert('Não há imagens selecionadas, por favor defina a imagem de referência e comparativa')
      return;
    }

    const resultView = {
      id: 'result',
      data: [],
      column: previewImg.column,
      line: previewImg.line,
    }

    const refData = previewImg.data;
    const compData = previewImgB.data;

    if(param === 'equal'){
      for(let i=0; i<refData.length; i++){
        if(refData[i] === compData[i]){
          resultView.data.push(refData[i]);
        }
        else{
          resultView.data.push('255');
        }
      }
    }

    if(param === 'dif'){
      for(let i=0; i<refData.length; i++){
        if(refData[i] !== compData[i]){
          resultView.data.push('0');
        }
        else{
          resultView.data.push('255');
          
        }
      }
    }

    if(param === 'alt'){
      
      for(let i=0; i<refData.length; i++){
        if(refData[i] === compData[i]){
          resultView.data.push(refData[i]);
        }
        else{
          resultView.data.push('255');
        }
      }

      for(let i=0; i<refData.length; i++){
        if(refData[i] !== resultView.data[i]){
          resultView.data[i] = '150'; //vermelho
        }
      }

      

      for(let i=0; i<refData.length; i++){
        if(compData[i] !== resultView.data[i]){

          if(resultView.data[i] !== '150'){
            resultView.data[i] = '50'; //azul
          }
          
        }
      }
    }

    setPreviewCompared(resultView);

    dataCompare();
  })

  const dataCompare = (() => {

    const tolerancia = sliderValue;

    const totalPx = previewImg.data.length;
    //const blackPxOrig = previewImg.data.filter(px => px ==='0').length;
    //const blackPxComp = previewImgB.data.filter(px => px ==='0').length;

    //const porcentagemIgualdade = (blackPxOrig/blackPxComp) * 100


    const refData = previewImg.data;
    const compData = previewImgB.data;

    let pxMesmaPos = 0;

    for(let i=0; i<refData.length; i++){
      if(refData[i] === compData[i]){
        pxMesmaPos++;
      }
    }

    const semelhanca = (pxMesmaPos/totalPx)*100;
    let diferenca = (1-(pxMesmaPos/totalPx))*100;

    let finalResult = false;

    if(diferenca <= tolerancia){
      finalResult = true;
    }

    const compareDataResult = {
      totalPx,
      semelhanca,
      diferenca,
      tolerancia,
      finalResult
    }
    setCompareDataResult(compareDataResult)
  })

  const handleSlideChange = ((e) => {
    setSliderValue(e.target.value);
  })

  return (
    <div className="container">
      <h1 className="title is-2 has-text-centered my-6" >Comparador .pgm</h1>

      
      <div class="block subtitle is-5 has-text-centered">
        Comparador de arquivos <em>.pgm</em>, a partir de uma imagem de referência é verificado a semelhança à outro arquivo <em>.pgm</em>.
      </div>

      <div className="container has-text-centered m-5">
      <div class="block subtitle is-5">
        <strong>Como funciona:</strong>
      </div>
      <div class="block subtitle is-5 ">
        <strong>1) </strong>defina a tolerância, no qual um arquivo é considerado semelhante ao outro.
      </div>
      <div class="block subtitle is-5">
        <strong>2) </strong>selecione o arquivo de referência.
      </div>
      <div class="block subtitle is-5">
        <strong>3) </strong>selecione o arquivo que será comparado com o de referência.
      </div>
      <div class="block subtitle is-5">
        <strong>4) </strong>aplique um dos filtros <em>Igualdade</em>, <em>Diferença</em> ou <em>Alt</em> (<span class="tag is-info"></span> pixel adicionado, <span class="tag is-danger"></span> pixel removido, <span class="tag is-black"></span> pixel igual).
      </div>
      </div>


      <div className="container has-text-centered m-5">
        <p className="title is-4">Tolerância</p>
        
      
        <input type="range" min={0} max={100} value={sliderValue} className="slider" onChange={handleSlideChange} />
        <p className="subtitle">{sliderValue}%</p>
      </div>
      
      <div className="columns box has-text-centered">

        <div className="column is-one-third">
          <p className="title is-4">Referência</p>
          {previewImg ?  <TableItem data={previewImg}/>
            : <img alt="Temp" src="https://bulma.io/images/placeholders/256x256.png"></img>
          }
            <input className="button" type="file" accept="image/pgm" onChange={e => handleChangeFile(e.target.files[0], 'orig')}></input>  
        </div>

        <div className="column is-one-third">
          <p className="title is-4">Comparativa</p>

          {previewImgB ? <TableItem data={previewImgB}/>
            : <img alt="Temp" src="https://bulma.io/images/placeholders/256x256.png"></img>
          }
  
          <input className="button" type="file" accept="image/pgm" onChange={e => handleChangeFile(e.target.files[0], 'comp')}></input>
        </div>

        <div className="column is-one-third">
          <p className="title is-4">Resultado</p>

          {previewCompared ? <TableItem data={previewCompared}/>
            : <img alt="Temp" src="https://bulma.io/images/placeholders/256x256.png"></img>
          }

          <div className="buttons">
            <button className="button is-success" id="equal" onClick={() => {compareImages("equal")}}>Igualdade</button>

            <button className="button is-danger" id="dif" onClick={() => {compareImages("dif")}}>Diferença</button>

            <button className="button is-info" id="dif" onClick={() => {compareImages("alt")}}>Alt</button>
          </div>
        </div>
      </div>

      

      <div className="has-text-centered mb-5 mx-5">

        {compareDataResult && (
          <div className="box">
            <p>
              {compareDataResult.finalResult ? <span className="tag is-success is-large">Imagem Igual</span> : <span className="tag is-danger is-large">Imagem Diferente</span>}<br/>

              <strong>Tolerâcia </strong>{compareDataResult.tolerancia}%<br/>
              <strong>Semelhança </strong>{compareDataResult.semelhanca}%<br/>
              <strong>Total de Pixels </strong>{compareDataResult.totalPx}
            </p>


            </div>
          )}
      </div>
      
    </div>
  );
}

export default App;
