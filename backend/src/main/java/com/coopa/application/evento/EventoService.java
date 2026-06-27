package com.coopa.application.evento;

import com.coopa.application.auth.AuthService;
import com.coopa.application.evento.dto.EventoRequestDTO;
import com.coopa.application.evento.dto.EventoResponseDTO;
import com.coopa.domain.auth.User;
import com.coopa.domain.evento.Evento;
import com.coopa.domain.evento.EventoRepository;
import com.coopa.domain.inscricao.InscricaoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class EventoService {

    private final EventoRepository eventoRepository;
    private final InscricaoRepository inscricaoRepository;
    private final AuthService authService;

    public List<EventoResponseDTO> listarAtivos(String userId) {
        return eventoRepository.findByAtivoTrueOrderByCriadoEmDesc().stream()
                .map(e -> toDTO(e, userId))
                .toList();
    }

    public EventoResponseDTO buscarPorId(String id, String userId) {
        Evento evento = getEvento(id);
        return toDTO(evento, userId);
    }

    public EventoResponseDTO criar(EventoRequestDTO dto, String userId) {
        User user = authService.getById(userId);

        Evento evento = Evento.builder()
                .organizadorId(userId)
                .organizadorNome(user.getNome())
                .titulo(dto.titulo())
                .jogo(dto.jogo())
                .data(dto.data())
                .horario(dto.horario())
                .nomeLocal(dto.nomeLocal())
                .endereco(dto.endereco())
                .lat(dto.lat())
                .lng(dto.lng())
                .descricao(dto.descricao())
                .oQueLevar(dto.oQueLevar())
                .infraestrutura(dto.infraestrutura())
                .maxParticipantes(dto.maxParticipantes())
                .totalInscritos(0)
                .criadoEm(System.currentTimeMillis())
                .ativo(true)
                .build();

        evento = eventoRepository.save(evento);
        log.info("Evento criado: {} por {}", evento.getTitulo(), userId);
        return toDTO(evento, userId);
    }

    public EventoResponseDTO editar(String id, EventoRequestDTO dto, String userId) {
        Evento evento = getEvento(id);

        if (!evento.getOrganizadorId().equals(userId)) {
            throw new IllegalArgumentException("Apenas o organizador pode editar o evento");
        }

        evento.setTitulo(dto.titulo());
        evento.setJogo(dto.jogo());
        evento.setData(dto.data());
        evento.setHorario(dto.horario());
        evento.setNomeLocal(dto.nomeLocal());
        evento.setEndereco(dto.endereco());
        evento.setLat(dto.lat());
        evento.setLng(dto.lng());
        evento.setDescricao(dto.descricao());
        evento.setOQueLevar(dto.oQueLevar());
        evento.setInfraestrutura(dto.infraestrutura());
        evento.setMaxParticipantes(dto.maxParticipantes());

        return toDTO(eventoRepository.save(evento), userId);
    }

    public void cancelar(String id, String userId) {
        Evento evento = getEvento(id);

        if (!evento.getOrganizadorId().equals(userId)) {
            throw new IllegalArgumentException("Apenas o organizador pode cancelar o evento");
        }

        evento.setAtivo(false);
        eventoRepository.save(evento);
        log.info("Evento cancelado: {}", id);
    }

    public void incrementarInscritos(String eventoId) {
        Evento evento = getEvento(eventoId);
        evento.setTotalInscritos(evento.getTotalInscritos() + 1);
        eventoRepository.save(evento);
    }

    public void decrementarInscritos(String eventoId) {
        Evento evento = getEvento(eventoId);
        int atual = evento.getTotalInscritos() == null ? 0 : evento.getTotalInscritos();
        evento.setTotalInscritos(Math.max(0, atual - 1));
        eventoRepository.save(evento);
    }

    private Evento getEvento(String id) {
        return eventoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Evento não encontrado"));
    }

    private EventoResponseDTO toDTO(Evento e, String userId) {
        boolean inscrito = userId != null &&
                inscricaoRepository.findByEventoIdAndUserId(e.getId(), userId)
                        .map(i -> i.isAtiva())
                        .orElse(false);

        return new EventoResponseDTO(
                e.getId(), e.getOrganizadorId(), e.getOrganizadorNome(),
                e.getTitulo(), e.getJogo(), e.getData(), e.getHorario(),
                e.getNomeLocal(), e.getEndereco(), e.getLat(), e.getLng(),
                e.getDescricao(), e.getOQueLevar(), e.getInfraestrutura(),
                e.getMaxParticipantes(), e.getTotalInscritos(), inscrito,
                e.getCriadoEm()
        );
    }
}
