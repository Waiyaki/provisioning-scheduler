import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import { selectors as authSelectors } from '../../redux/modules/auth';
import {
  createTask, fetchTasks, updateTask, selectors as tasksSelectors
} from '../../redux/modules/tasks';

import { Scheduler } from '../../components';

class SchedulerContainer extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.isCreate = this.isCreate.bind(this);
  }

  componentDidMount() {
    this.props.fetchTasks();
  }

  componentWillReceiveProps(nextProps) {
    const { auth: { isAuthenticated } } = nextProps;
    if (!isAuthenticated) {
      browserHistory.push('/welcome');
    }
  }

  onSubmit(data) {
    const submit = this.isCreate()
      ? this.props.createTask : this.props.updateTask;
    return submit(data)
      .then(response => {
        const { data: { id } } = response;
        browserHistory.push(`/tasks/${id}`);
      });
  }

  isCreate() {
    const { location: { pathname } } = this.props;
    return pathname === '/tasks/create';
  }

  isAtHome() {
    const { location: { pathname } } = this.props;
    return /\/tasks\/?$/.test(pathname);
  }

  render() {
    const { tasks, items, children } = this.props;
    return (
      <Scheduler
        {...{
          onSubmit: this.onSubmit,
          isAtHome: this.isAtHome(),
          tasks,
          items,
          children
        }}
      />
    );
  }
}

SchedulerContainer.propTypes = {
  auth: PropTypes.object.isRequired,
  children: PropTypes.element,
  createTask: PropTypes.func.isRequired,
  fetchTasks: PropTypes.func.isRequired,
  error: PropTypes.object,
  items: PropTypes.array.isRequired,
  location: PropTypes.object.isRequired,
  tasks: PropTypes.object.isRequired,
  updateTask: PropTypes.func.isRequired
};

const { getAuth } = authSelectors;
const { getTasks, getItems } = tasksSelectors;

export default connect(
  state => ({
    auth: getAuth(state),
    tasks: getTasks(state),
    items: getItems(state)
  }),
  { createTask, fetchTasks, updateTask }
)(SchedulerContainer);
