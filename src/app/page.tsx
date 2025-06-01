import Link from "next/link";
import { Button, Card } from "antd";
import {HomeOutlined, ApartmentOutlined, ContactsOutlined, UserOutlined} from "@ant-design/icons";

export default function Home() {
    return (
        <>
            <h1 className="text-3xl font-bold mb-6">Azur-Immo</h1>

            <Card title="Gestion Immobilière" className="shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    <Link href="/locataires" className="block">
                        <Button type="primary" icon={<UserOutlined />} block>
                            Gérer les Locataires
                        </Button>
                    </Link>
                </div>
            </Card>
        </>
    );
}