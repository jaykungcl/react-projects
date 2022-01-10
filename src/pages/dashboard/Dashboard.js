import { useState } from 'react';
import ProjectList from '../../components/ProjectList';
import { useCollection } from '../../hooks/useCollection'
import { useAuthContext } from '../../hooks/useAuthContext';
import ProjectFilter from './ProjectFilter';

// styles
import './Dashboard.css'


export default function Dashboard() {
    const { user } = useAuthContext();
    const { documents, error } = useCollection('projects');
    const [currentFilter, setCurrentFilter] = useState('all')

    const changeFilter = (filter) => {
        setCurrentFilter(filter)
    }

    const projects = documents ? documents.filter((project) => {
        switch(currentFilter) {
            case 'all':
                return true
            case 'mine':
                let assignedToMe = false
                project.assignedUsersList.forEach((u) => {
                    if(user.uid === u.id) {
                        assignedToMe = true
                    }
                })
                return assignedToMe
            case 'development':
            case 'design':
            case 'marketing':
            case 'sales':
                return project.category === currentFilter
            default:
                return true
        }
    }) : null;

    return (
        <div>
            <h2 className="page-title">Dashboard</h2>
            {error && <p className="error">{error}</p>}
            {projects && (
                <ProjectFilter currentFilter={currentFilter} changeFilter={changeFilter} />
            )}
            {projects && <ProjectList projects={projects} />}
        </div>
    )
}
