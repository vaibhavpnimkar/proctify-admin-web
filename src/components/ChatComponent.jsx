import React from 'react';
import './chatcomponentstyles.css';

const ChatComponent = () => {
    return (
        <div style={{ width: '30%' }}>
            <select>
                {/* Add options for selecting users */}
            </select>
            <div style={{ height: 'calc(100% - 100px)', overflowY: 'scroll' }}>
                {/* Add messages here */}
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <input type="text" placeholder="Type your message" />
                <button>Send</button>
            </div>
        </div>
    );
};

export default ChatComponent;
