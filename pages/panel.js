import Layout from '@/components/Layout';
import AccountPrompt from '@/components/Form/Prompt';
import AccountDetails from '@/components/Panel/AccountDetails';
import PasswordManagement from '@/components/Panel/PasswordManagement';
import LoginActivity from '@/components/Panel/LoginActivity';

import authenticateUser from '@/lib/authentication';
import {account, loginHistory} from '@/lib/database';

import censorIp from '@/utils/censorIp';

import {
    Col,
    Nav,
    Row,
    Tab
} from 'react-bootstrap';

export async function getServerSideProps({ req, res }){
    const authHeader = req.headers['cookie']
    const token = authHeader && authHeader.split('token=')[1];
    if (token == null){
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    }
    try{
        const {username} = await authenticateUser(token);
        const accountQuery =  await account.findOne({
            include: [loginHistory],
            where: {
                username: username
            }
        });
        
        if(!accountQuery){
            return {
                redirect: {
                    destination: '/logout',
                    permanent: false,
                },
            }
        }
        const loginHistoryQuery = accountQuery.login_histories;

  
        
        return {
            props: {
                user: username,
                accountDetails: {
                    'username': accountQuery.username,
                    'email': accountQuery.email,
                    'createdAt': accountQuery.created_at.toString(),
                    'apiKey': account.api_key ? account.api_key : 'Not Activated'
                },
                loginHistory: loginHistoryQuery.map((loginRecord) => ({
                    'ipAddress': loginRecord.ip_address,
                    'loginDate': loginRecord.login_date.toString()
                })).reverse(),
                lastLoginIP: loginHistoryQuery.length === 0 ? 'N/A' : censorIp(loginHistoryQuery[loginHistoryQuery.length-1].ip_address),
                lastLoginDate: loginHistoryQuery.length === 0 ? 'N/A' : loginHistoryQuery[loginHistoryQuery.length-1].login_date.toString(),
            }
        }
    }
    catch(e){
        console.log(e)
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    }
};


export default function Panel(props){
    return (
        <>
            <Layout user={props.user}>
                <AccountPrompt headerText='Panel' width={'900px'} height={'300px'}>
                    <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                        <Row id='account-panel-row'>
                            <Col sm={3} className='panel-sidebar-border'>
                                <Nav variant="pills" className="flex-column">
                                    <Nav.Item>
                                        <Nav.Link eventKey="first">Account Details</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="second">Change Password</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="third">Change Email</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="fourth">Login History</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Col>
                            <Col sm={9}>
                            <Tab.Content>
                                <Tab.Pane eventKey="first">
                                    <AccountDetails accountDetails={props.accountDetails} lastLoginDate={props.lastLoginDate} lastLoginIP={props.lastLoginIP}/>
                                </Tab.Pane>
                                <Tab.Pane eventKey="second">
                                    <PasswordManagement/>
                                </Tab.Pane>
                                <Tab.Pane eventKey="third">
                                    <>Someth</>
                                </Tab.Pane>
                                <Tab.Pane eventKey="fourth">
                                    <LoginActivity loginHistory={props.loginHistory}/>
                                </Tab.Pane>
                            </Tab.Content>
                            </Col>
                        </Row>
                    </Tab.Container>
                </AccountPrompt>
            </Layout>
        </>
    )
}
