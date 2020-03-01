import * as React from 'react';
import Axios, {CancelTokenSource} from 'axios';
import {fetchMessages, Message} from '../client';
import {Segment, Image, Comment, Header,Dimmer,Loader} from 'semantic-ui-react';

interface MessageFeedProps{
	channelName: string;
	shouldReload: boolean;
	setShouldReload: (shouldReload: boolean)=>void;
}

interface MessageFeedState{
	messages: Message[];
}

export class MessageFeed extends React.Component<MessageFeedProps, MessageFeedState>{
	private CancelTokenSource: CancelTokenSource;//컴포넌트가 언마운트 될 때 비동기 처리를 중단하도록 처리하기 위해
	constructor(props: MessageFeedProps){
		super(props);
		this.state={
			messages:[]
		};
		this.CancelTokenSource=null;
	}

	public render(){
	return(
		<Comment.Group>
			<Header as='h3' dividing>{this.props.channelName}</Header>
			{this.state.messages.slice().reverse().map(message=>
				<Comment key={message.id}>
					<Comment.Avatar src={message.user.avatar||'/img/avatar.png'}/>
					<Comment.Content>
						<Comment.Author as='a'>{message.user.name}</Comment.Author>
						<Comment.Metadata>
							<div>{message.date}</div>
						</Comment.Metadata>
						<Comment.Text>
							{message.body}
						</Comment.Text>
					</Comment.Content>	
				</Comment>
				)}
		</Comment.Group>
		);
	}

	private fetchMessages=(channelName: string)=>{
		this.props.setShouldReload(false);
		this.CancelTokenSource=Axios.CancelToken.source();//cancelToken 생성

		fetchMessages(channelName,{},this.CancelTokenSource.token)
		.then(response=>{
			this.setState({messages: response.data.messages});
		})
		.catch(err=>{
			if(Axios.isCancel(err)){//비동기처리가 완전히 중단되는 것이 아니라 예외가 발생하므로 이를 구별해 준다.
				console.log(err);
			}else{
				console.log(err);
			}
		});
	}

	public componentWillUnmount(){
		if(this.CancelTokenSource){
			//비동기처리 취소
			this.CancelTokenSource.cancel('This component has been unmounted');
		}
	}

	public componentDidMount(){
		this.fetchMessages(this.props.channelName);
	}

	public componentDidUpdate(prevProps:MessageFeedProps){
		if(prevProps.channelName!==this.props.channelName||
			!prevProps.shouldReload&&this.props.shouldReload){//shouldReload가 false에서 true로 바뀔때
			this.fetchMessages(this.props.channelName);
		}
	}
}
