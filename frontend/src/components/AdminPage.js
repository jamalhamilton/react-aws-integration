import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import { BrowserRouter as Router, useHistory } from "react-router-dom";
import { Modal, Table, Spinner, Alert, Button, ButtonGroup } from "react-bootstrap";
import config from "../config/front_config";

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState();
    const [error, setError] = useState();
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState();
    const [itemToDeleteIndex, setItemToDelete] = useState();
    const history = useHistory();

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        const token = localStorage.getItem("authToken");
        if (token) {
            try {
                setIsLoading(true);
                const users = await fetch(config.api.adminGetAllUsers, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token,
                    },
                    method: "GET"
                }).then(res => res.json());
                setIsLoading(false);
                if (users && users['data'] && users['data'].length) {
                    setUsers(users['data']);
                } else {
                    setError('Sorry!, No records found!');
                }
            }
            catch (err) {
                setError('Sorry!, Got issue on loading the records');
                setIsLoading(false);
            }
        } else {
            history.push('/login');
        }
    }

    const deleteConfermation = () => {
        if (showDeleteConfirmation) {
            return (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        textAlign: 'center',
                        backgroundColor: 'rgba(16, 16, 16, 0.5)',
                        zIndex: 999
                    }}>
                    <Modal.Dialog>
                        <Modal.Header>
                            <Modal.Title>Delete user!</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>Are you sure to remove this user?</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={() => setShowDeleteConfirmation(false)} variant="secondary">No</Button>
                            <Button onClick={() => confirmDelete()} variant="danger">yes, Delete</Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </div>
            );
        }
    }

    const deleteItem = (itemIndex) => {
        setShowDeleteConfirmation(true);
        setItemToDelete(itemIndex);
    }

    const confirmDelete = () => {
        setShowDeleteConfirmation(false);
        const token = localStorage.getItem("authToken");
        if (token) {
            setIsLoading(true);
            fetch(config.api.adminDeleteUser, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
                method: "POST",
                body: JSON.stringify({
                    id: users[itemToDeleteIndex].id,
                    token: users[itemToDeleteIndex].token
                })
            }).then(res => res.json()).then(data => {
                setIsLoading(false);
                if (data['success']) {
                    const newUserList = users;
                    newUserList.splice(itemToDeleteIndex, 1);
                    setUsers(newUserList);
                    setItemToDelete(undefined);
                    if (!(users && users.length)) {
                        setError('Sorry!, No records found!');
                    }
                } else {
                    setError(data['message'] ? data['message'] : 'Issue on deleting user');
                }
            })
                .catch(err => {
                    setIsLoading(false);
                    setError("Issue on deleting! ", err);
                })
        } else {
            history.push('/login');
        }
    }

    const logout = () => {
        localStorage.removeItem("authToken");
        history.push('/login');
    }

    return (
        <div class="innerPage" style={{ backgroundImage: "linear-gradient(#25C14F, #fff)", overflow: 'auto' }}>
            <Button style={{ margin: 30, height: 50, width: 150, border: 0, float: 'right', backgroundImage: "linear-gradient(#fff, #25C14F)" }} onClick={() => logout()}><i className="fa fa-sign-out-alt"></i> Logout</Button>
            {isLoading ? <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    textAlign: 'center',
                    backgroundColor: 'rgba(16, 16, 16, 0.5)',
                    zIndex: 999
                }}>
                <Spinner style={{ textAlign: 'center', marginTop: '30%', color: 'white' }} animation="border" />
            </div> : null}
            {!isLoading && <div class="container whiteWrap" style={{ marginTop: 100, overflow: 'scroll' }}>
                <Table style={{ tableLayout: 'auto', color: '#555555' }} striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Candidate First Name</th>
                            <th>Candidate Last Name</th>
                            <th>Candidate Email</th>
                            <th>Photo Verification</th>
                            <th>ID Verification</th>
                            <th>Result Verification</th>
                            <th>Interview Date and Time</th>
                            <th>Social Link</th>
                            <th>Interviewer First Name</th>
                            <th>Interviewer Last Name</th>
                            <th>Interviewer Email</th>
                            <th>Similarity</th>
                            <th>Vouched verification</th>
                            <th>Recruiter First Name</th>
                            <th>Recruiter Last Name</th>
                            <th>Recruiter Email</th>
                            <th>Company Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    {(!error) ?
                        <tbody>
                            {users.map((user, index) => {
                                return (
                                    <tr key={index} style={{ lineBreak: 'anywhere' }}>
                                        <td>{index + 1}</td>
                                        <td>{user['candidate_name_first'] ? user['candidate_name_first'] : '--'}</td>
                                        <td>{user['candidate_name_last'] ? user['candidate_name_last'] : '--'}</td>
                                        <td>{user['candidate_email'] ? user['candidate_email'] : '--'}</td>
                                        <td>{user['verify_photo'] ? user['verify_photo'] : '--'}</td>
                                        <td>{user['verify_idcard'] ? user['verify_idcard'] : '--'}</td>
                                        <td>{user['verify_result'] ? user['verify_result'] : '--'}</td>
                                        <td>{user['date_of_interview'] ? user['date_of_interview'] : '--'}</td>
                                        <td>{user['social_link'] ? user['social_link'] : '--'}</td>
                                        <td>{user['interviewer_name_first'] ? user['interviewer_name_first'] : '--'}</td>
                                        <td>{user['interviewer_name_last'] ? user['interviewer_name_last'] : '--'}</td>
                                        <td>{user['interviewer_email'] ? user['interviewer_email'] : '--'}</td>
                                        <td>{user['similarity'] ? user['similarity'] : '--'}</td>
                                        <td>{user['id_verification_result'] ? user['id_verification_result'] : '--'}</td>
                                        <td>{user['recruiter_first_name'] ? user['recruiter_first_name'] : '--'}</td>
                                        <td>{user['recruiter_last_name'] ? user['recruiter_last_name'] : '--'}</td>
                                        <td>{user['recruiter_email'] ? user['recruiter_email'] : '--'}</td>
                                        <td>{user['company_name'] ? user['company_name'] : '--'}</td>
                                        <td>
                                            <ButtonGroup size="sm">
                                                <Button onClick={() => history.push(`/admin/update/${user['token']}`)}><i className="fa fa-edit"></i></Button>
                                                <Button onClick={() => deleteItem(index)} variant="danger"><i className="fa fa-trash"></i></Button>
                                            </ButtonGroup>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody> : null}
                </Table>
                {error ? <Alert style={{ marginTop: 20 }} variant="danger">{error}!</Alert> : null}
                {deleteConfermation()}
            </div>}
        </div>
    );
}

export default withRouter(AdminPage);