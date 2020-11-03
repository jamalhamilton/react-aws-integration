import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import { BrowserRouter as Router, useHistory } from "react-router-dom";
import { Container, Row, Modal, Table, Spinner, Alert, Button, ButtonGroup } from "react-bootstrap";
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
                <Modal.Dialog>
                    <Modal.Header>
                        <Modal.Title>Delete user!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>do confirm it.</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => setShowDeleteConfirmation(false)} variant="secondary">No, Don't</Button>
                        <Button onClick={() => confirmDelete()} variant="danger">yes, Delete</Button>
                    </Modal.Footer>
                </Modal.Dialog>
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

    return (
        <Router>
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
                    <Spinner style={{ textAlign: 'center', marginTop: '30%' }} animation="border" />
            </div> : null}
            <Table style={{ tableLayout: 'fixed' }} striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Photo Verification</th>
                        <th>ID Verification</th>
                        <th>Result Verification</th>
                        <th>Interview Date</th>
                        <th>Social Link</th>
                        <th>Interviewer First Name</th>
                        <th>Interviewer Last Name</th>
                        <th>Interviewer Email</th>
                        <th>Action</th>
                    </tr>
                </thead>
                {(!isLoading && !error) ?
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
                                    <td>
                                        <ButtonGroup size="sm">
                                            <Button><i className="fa fa-pencil-square-o"></i></Button>
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
        </Router>
    );
}

export default withRouter(AdminPage);