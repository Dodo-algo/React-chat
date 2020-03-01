import * as React from 'react';
import {match} from 'react-router-dom';
import {MessageFeed, MessageForm} from '../components';

//Recat에서 데이터의 흐름은 원칙적으로 부모 컴포넌트에서 자식 컴포넌트로 전달되게 되어있다.
//따라서 부모 관계가 아닌 컴포넌트 간에는 직접 정보를 주고받을 수가 없다. 그래서 부모를 경유해야 한다.
//부모 컴포넌트는 Channel이고, import MessageFeed,MessageForm을 하였기때문에 이들이 자식 컴포넌트이다.

interface ChannelMatch{
	channelName: string;
}
interface ChannelProps{
	match: match<ChannelMatch>;
}
interface ChannelState{
	shouldReload: boolean;
}

export class Channel extends React.Component<ChannelProps,ChannelState>{
	constructor(props: ChannelProps){
		super(props);
		this.state={
			shouldReload:false
		}
	}

	private setShouldReload=(shouldReload:boolean)=>{//인자를 갖기 위해 바인딩 대신 화살표 함수로 정의한다.
		this.setState({shouldReload});
	}

	public render(){
		const {channelName} = this.props.match.params;
		return(//하나 이상의 요소를 반환하려면 배열을 반환하면 된다. 그래서 []를 사용
			[
			<MessageFeed key='message-feed'
			 channelName={channelName}
			 shouldReload={this.state.shouldReload}
			 setShouldReload={this.setShouldReload}/>,
			<MessageForm key='message-form'
			 channelName={channelName}
			 setShouldReload={this.setShouldReload}/>
			]
		);
	}
}