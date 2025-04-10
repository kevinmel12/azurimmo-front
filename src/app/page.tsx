import Link from "next/link";
import { Button, Card, Space } from "antd";
import { HomeOutlined, ApartmentOutlined, ContactsOutlined } from "@ant-design/icons";

function ContratOutlined() {
    return null;
}

export default function Home() {
    return (
        <>
            <h1 className="text-3xl font-bold mb-6">Azur-Immo</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card title="Gestion Immobilière" className="shadow-md">
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <Link href="/batiments" className="block">
                            <Button type="primary" icon={<HomeOutlined />} block>
                                Gérer les Bâtiments
                            </Button>
                        </Link>

                        <Link href="/appartements" className="block">
                            <Button type="primary" icon={<ApartmentOutlined />} block>
                                Gérer les Appartements
                            </Button>
                        </Link>

                        <Link href="/contrats" className="block">
                            <Button type="primary" icon={<ContactsOutlined />} block>
                                Gérer les Contrats
                            </Button>
                        </Link>
                    </Space>
                </Card>
            </div>
        </>
    );
}