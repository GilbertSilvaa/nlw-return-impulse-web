import { MailAdapter } from '../adapters/mail-adapter';
import { FeedbacksRepository } from '../repositories/feedbacks-repository';

interface SubmitFeedbackUseCaseRequest {
  type: string;
  comment: string;
  screenshot?: string;
}

export class SubmitFeedbackUseCase {
  constructor(
    private feedbackRepository: FeedbacksRepository,
    private mailAdapter: MailAdapter
  ){}

  async execute({ type, comment, screenshot }: SubmitFeedbackUseCaseRequest) {

    if (!type) {
      throw new Error('Type not exist.');
    }
    if (!comment) {
      throw new Error('Comment not exist.');
    }
    if (screenshot && !screenshot.startsWith('data:image/png;base64')) {
      throw new Error('Invalid screenshot format.');
    }

    await this.feedbackRepository.create({
      type,
      comment,
      screenshot
    })

    await this.mailAdapter.sendMail({
      subject: 'Novo Feedback',
      body: [
        `<div style="font-family: sans-serif; font-size: 17px; color: #111">`,
        `<p>Tipo do Feedback: ${ type }</p>`,
        `<p>Comentário: ${ comment }</p>`,
        screenshot ? `<img src="${ screenshot }" alt='screenshot' />` : ``,
        `</div>`
      ].join('\n')
    })
  }
}