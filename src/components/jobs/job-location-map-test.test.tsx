import { render, screen } from '@testing-library/react';
import { JobLocationMapTest } from './job-location-map-test';
import { ProductRoleEnum } from '@/types/entities/user.entity';

const mockLeafletMap = {
  remove: jest.fn(),
  fitBounds: jest.fn(),
};

const markerChain = {
  addTo: jest.fn().mockReturnThis(),
  bindPopup: jest.fn().mockReturnThis(),
};

jest.mock('@/hooks/use-auth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('leaflet', () => ({
  map: jest.fn(() => mockLeafletMap),
  tileLayer: jest.fn(() => ({ addTo: jest.fn() })),
  divIcon: jest.fn(() => ({})),
  marker: jest.fn(() => markerChain),
  latLngBounds: jest.fn(() => ({})),
}));

const { useAuth } = jest.requireMock('@/hooks/use-auth') as { useAuth: jest.Mock };

describe('JobLocationMapTest', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  const company = {
    tradeName: 'Smart Fit',
    contacts: {
      address: {
        street: 'Rua A',
        number: '100',
        city: 'Sao Paulo',
        state: 'SP',
        country: 'BR',
      },
    },
  };

  it('renderiza loading e depois distância do candidato', async () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: {
        name: 'Rebeca',
        productRole: ProductRoleEnum.CANDIDATE,
        candidateProfile: {
          contacts: {
            address: {
              street: 'Rua B',
              number: '200',
              city: 'Sao Paulo',
              state: 'SP',
              country: 'BR',
            },
          },
        },
      },
    });

    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ lat: '-23.55', lon: '-46.63' }],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ lat: '-23.56', lon: '-46.64' }],
      }) as never;

    render(<JobLocationMapTest company={company as never} />);

    expect(screen.getByText('Carregando mapa...')).toBeInTheDocument();
    expect(await screen.findByText(/km/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'openMaps' })).toHaveAttribute(
      'href',
      expect.stringContaining('google.com/maps/search'),
    );
  });

  it('mostra erro quando geocoding falha', async () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
    });

    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => [],
    }) as never;

    render(<JobLocationMapTest company={company as never} />);

    expect(
      await screen.findByText('Não foi possível carregar o mapa navegável.'),
    ).toBeInTheDocument();
  });

  it('mostra indisponibilidade quando candidato não tem coordenadas', async () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: {
        productRole: ProductRoleEnum.CANDIDATE,
        candidateProfile: { contacts: { address: undefined } },
      },
    });

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ lat: '-23.55', lon: '-46.63' }],
    }) as never;

    render(<JobLocationMapTest company={company as never} />);

    expect(await screen.findByText(/Complete seu/)).toBeInTheDocument();
  });

  it('mostra mensagem quando academia não é localizada', async () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
    });

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    }) as never;

    render(<JobLocationMapTest company={company as never} />);

    expect(
      await screen.findByText('Não foi possível localizar a academia no mapa.'),
    ).toBeInTheDocument();
  });
});
