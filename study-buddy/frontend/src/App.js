import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import StudyGroupList from './components/StudyGroupList';
import StudyGroup from './components/StudyGroup';
import CreateGroup from './components/CreateGroup';
import Profile from './components/Profile';

const App = () => {
    return (
        <Router>
            <Switch>
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <Route path="/groups" component={StudyGroupList} />
                <Route path="/groups/create" component={CreateGroup} />
                <Route path="/groups/:id" component={StudyGroup} />
                <Route path="/profile" component={Profile} />
                <Route path="/" exact component={Login} />
            </Switch>
        </Router>
    );
};

export default App;
