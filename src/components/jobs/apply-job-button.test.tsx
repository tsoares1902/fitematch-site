import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApplyJobButton } from './apply-job-button';
import { ApplyService } from '@/services/apply/apply.service';
import { ProductRoleEnum } from '@/types/entities/user.entity';

const refresh = jest.fn();
const showSuccess = jest.fn();
const showError = jest.fn();

jest.mock('next/navigation', () => ({
  __esModule: true,
  useRouter: () => ({
    refresh,
  }),
}));

jest.mock('@/contexts/flash-message-context', () => ({
  useFlashMessage: () => ({
    showSuccess,
    showError,
  }),
}));

jest.mock('@/hooks/use-auth', () => ({
  useAuth: jest.fn(),
}));

const { useAuth } = jest.requireMock('@/hooks/use-auth') as {
  useAuth: jest.Mock;
};

describe('ApplyJobButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('não renderiza botão para usuário não candidato', () => {
    useAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
    });

    render(<ApplyJobButton jobId="job-1" />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renderiza botão desabilitado quando já aplicou', () => {
    useAuth.mockReturnValue({
      user: {
        productRole: ProductRoleEnum.CANDIDATE,
      },
      isAuthenticated: true,
    });

    render(<ApplyJobButton jobId="job-1" hasAlreadyApplied />);

    expect(screen.getByRole('button', { name: /Candidatura enviada/i })).toBeDisabled();
  });

  it('abre modal e aplica com sucesso ao confirmar', async () => {
    const user = userEvent.setup();
    const onApplied = jest.fn();
    const refetch = jest.fn();

    useAuth.mockReturnValue({
      user: {
        productRole: ProductRoleEnum.CANDIDATE,
      },
      isAuthenticated: true,
    });
    jest.spyOn(ApplyService, 'create').mockResolvedValue({ _id: 'apply-1' } as never);

    render(<ApplyJobButton jobId="job-1" onApplied={onApplied} refetch={refetch} />);

    await user.click(screen.getByRole('button', { name: /Aplicar/i }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(ApplyService.create).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: /Confirmar aplicação/i }));

    await waitFor(() => {
      expect(ApplyService.create).toHaveBeenCalledWith({ jobId: 'job-1' });
    });
    expect(showSuccess).toHaveBeenCalledWith('Candidatura realizada com sucesso.');
    expect(refetch).toHaveBeenCalled();
    expect(onApplied).toHaveBeenCalled();
    expect(refresh).toHaveBeenCalled();
  });

  it('mostra erro para recrutador', async () => {
    const user = userEvent.setup();

    useAuth.mockReturnValue({
      user: {
        productRole: ProductRoleEnum.RECRUITER,
      },
      isAuthenticated: true,
    });

    render(<ApplyJobButton jobId="job-1" />);

    expect(screen.queryByRole('button', { name: /Aplicar/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    await user.pointer([]);
  });

  it('mostra erro quando create falha', async () => {
    const user = userEvent.setup();

    useAuth.mockReturnValue({
      user: {
        productRole: ProductRoleEnum.CANDIDATE,
      },
      isAuthenticated: true,
    });
    jest.spyOn(ApplyService, 'create').mockRejectedValue(new Error('fail'));

    render(<ApplyJobButton jobId="job-1" />);

    await user.click(screen.getByRole('button', { name: /Aplicar/i }));
    await user.click(screen.getByRole('button', { name: /Confirmar aplicação/i }));

    await waitFor(() => {
      expect(showError).toHaveBeenCalledWith('Não foi possível realizar sua candidatura.');
    });
  });
});
