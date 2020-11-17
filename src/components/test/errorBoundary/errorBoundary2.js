import React from 'react';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo: errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return <h1>系统出现了错误，请联系管理员。</h1>;
        }
        return this.props.children;
    }
}
