import React from 'react';
import { Button, Divider } from 'antd';
import 'antd/lib/divider/style';
import 'antd/lib/button/style';
// import ErrorBoundary from './errorBoundary';
import ErrorBoundary from './errorBoundary2';

class BuggyCounter extends React.Component {
    constructor(props) {
        super(props);
        this.state = { counter: 0 };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState(({ counter }) => ({
            counter: counter + 1
        }));
    }

    render() {
        if (this.state.counter === 5) {
            // 模拟一个js错误
            throw new Error('I crashed!');
        }
        return <h1 onClick={this.handleClick}>{this.state.counter}</h1>;
    }
}

export default class ErrorBoundaryDemo extends React.Component {
    constructor(props) {
        super(props);
        this.state = { obj: { name: 'sss' } };
    }

    render() {
        return (
            <div style={{ backgroundColor: '#fff', padding: '16px' }}>
                <h2>有使用ErrorBoundary，但是是在事件处理中抛出的错误</h2>
                <ErrorBoundary>
                    {this.state.obj.name && (
                        <Button
                            type='primary'
                            onClick={() => {
                                throw new Error('I crashed!');
                            }}
                        >
                            With ErrorBoundary
                        </Button>
                    )}
                </ErrorBoundary>
                <Divider plain>我是分割线</Divider>
                <h2>有使用ErrorBoundary</h2>
                <div>
                    <p>
                        <b>
                            This is an example of error boundaries in React 16.
                            <br />
                            <br />
                            Click on the numbers to increase the counters.
                            <br />
                            The counter is programmed to throw when it reaches 5. This simulates a JavaScript error in a component.
                        </b>
                    </p>
                    <hr />
                    <ErrorBoundary>
                        <p>
                            These two counters are inside the same error boundary. If one crashes, the error boundary will replace both of
                            them.
                        </p>
                        <BuggyCounter />
                        <BuggyCounter />
                    </ErrorBoundary>
                    <hr />
                    <p>These two counters are each inside of their own error boundary. So if one crashes, the other is not affected.</p>
                    <ErrorBoundary>
                        <BuggyCounter />
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <BuggyCounter />
                    </ErrorBoundary>
                </div>
                <Divider />
            </div>
        );
    }
}
