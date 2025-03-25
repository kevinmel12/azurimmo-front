"use client";
import Batiment from "@/models/Batiment";
import Link from "next/link";
import {useState} from "react";
import {Button, Table, Tag} from "antd";
import AddBatimentComponent from "@/components/AddBatimentComponent";
import HttpService from "@/services/HttpService";
import API_URL from "@/constants/ApiUrl";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import '@ant-design/v5-patch-for-react-19';


export default function BatimentComponent({...props}:{batiments:Batiment[]}) {
    const [batiments, setBatiments] = useState<Batiment[]>(props.batiments);
    const [showAddDialog, setShowAddDialog] = useState<boolean>(false);

    const updateBatiment=(batiment:Batiment)=> {
        HttpService.post(API_URL.batiments,batiment).then((response)=>{
            setBatiments([...batiments,response]);
            setShowAddDialog(false);
        });
    };

    const batColumns=[
        {
            title:'Adresse',
            dataIndex:'adresse',
            key:'adresse'
        },
        {
            title:'Ville',
            dataIndex:'ville',
            key:'ville',
            render:(text:string)=>(
                <Tag color={"success"}>{text}</Tag>
            )
        },
        {
            title:'Actions',
            key:'action',
            render:(text:string,record:Batiment)=>(
                <>
                    <Button shape={"circle"} onClick={()=>{
                        console.log('record',record);
                    }}><EditOutlined /></Button>
                    <Button shape={"circle"} onClick={()=>{
                        console.log('record',record);
                    }}><DeleteOutlined/></Button>
                </>
            )
        }
    ];

    return (
        <>
            <h2>Bâtiments</h2>
            <Button onClick={()=>{
                setShowAddDialog(true);
            }}>Ajouter...</Button><br/>
            {showAddDialog && <AddBatimentComponent batiment={new Batiment()}
                                                    onClose={setShowAddDialog}
                                                    onSubmit={updateBatiment}
            />}
            <Link href={"/"}><Button>Retour à l'accueil</Button></Link>
            {!showAddDialog && <>
                <Table dataSource={batiments} rowKey={"id"} columns={batColumns}/>
            </>}
        </>);
}