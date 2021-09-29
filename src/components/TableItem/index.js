import { useEffect } from "react";

import "./styles.css";

export default function TableItem(props) {
    
    useEffect(() => {

        const {id, data, column, line} = props.data;

        let dataIndex = 0;
        let xTRs;
        let xTable = document.getElementById(id);
        xTable.innerHTML = '';

        for (let i = 0; i < line; i++) {
            xTable.appendChild(xTRs = document.createElement("tr"));
            for (let j = 0; j < column; j++) {
                let xTD = document.createElement("td");
                xTD.setAttribute('class', 'c'+data[dataIndex]);

                xTD.appendChild(document.createTextNode(''));
                
                xTRs.appendChild(xTD);
                dataIndex++;
            }
        }
    }, [props]);

    return(
        <>
            <table className="table-item" id={props.data.id}></table>

        </>
    )
}