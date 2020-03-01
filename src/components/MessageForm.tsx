import * as React from 'react';
import {postMessage,Message} from '../client';
import {Button,Form,Segment,TextArea,Dimmer,Loader} from 'semantic-ui-react';

//props와 state의 타입으로 사용할 인터페이스 정의
interface MessageFormProps{
	channelName:string;
	setShouldReload: (shouldReload:boolean)=>void;//Channel에서 넘겨받기 위해
}

interface MessageFormState{
	body?:string;
}

export class MessageForm extends React.Component<MessageFormProps,MessageFormState>{

	constructor(props:MessageFormProps){
		super(props);

		this.state={
			body:''
		};

		//내가 오버라이딩한 함수를 사용하겠다고 설정하는 것(바인딩)
		this.handleTextAreaChange=this.handleTextAreaChange.bind(this);
		this.handleFormSubmit=this.handleFormSubmit.bind(this);
	}

	public render(){
		return(
			<Segment basic textAlign='center'>
				<Form onSubmit={this.handleFormSubmit}>
					<Form.Field>
						<TextArea
						autoHeight
						placeholder='Write your message'
						value={this.state.body}
						onChange={this.handleTextAreaChange}/>
					</Form.Field>
					<Button primary type='submit'>Send</Button>
				</Form>
			</Segment>
			);
	}

	//데이터를 state에 반영해줄 메서드
	//texture 요소의 내용이 변경되었을 때 호출되는 것을 가정한 메서드
	private handleTextAreaChange(event: React.FormEvent<HTMLTextAreaElement>){
		event.preventDefault();//전달받은 이벤트 취소시킨다.
		this.setState({body:event.currentTarget.value});//TextArea에 입력된 값을 얻는다.
	}

	private handleFormSubmit(event: React.FormEvent<HTMLFormElement>){//메시지 송신->client.ts의 postMessage이용
		console.log("submit fucttion");
		event.preventDefault();
		const payload={
			body: this.state.body,//메시지 내용
			user:{
				id: '123',
				name: 'Jiyoung'
			}
		} as Message;

		postMessage(this.props.channelName, payload)
		.then(()=>{
			this.setState({body: ''});//요청 결과 성공하면 body가 ''로 바뀐다.
			this.props.setShouldReload(true);//메시지 송신이 성공하면 setShouldReload()실행
		})
		.catch(err=>{
			console.log(err);
		});
	}
}


