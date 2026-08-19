import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'videoPlayToggle',
  schema: {
    video: ecs.eid,
    iconoUi: ecs.eid,
  },
  stateMachine: ({world, eid, schemaAttribute}) => {
    // Aplica el estado de pausa al video y la opacidad al elemento de UI.
    const aplicarEstado = (pausado: boolean) => {
      // Se re-adquiere el schema dentro del callback (los cursors no se guardan)
      const {video, iconoUi} = schemaAttribute.get(eid)

      if (video) {
        ecs.VideoControls.mutate(world, video, (cursor) => {
          cursor.paused = pausado
          return false
        })
      }

      // Si no se enlaza un icono aparte, se atenua la propia entidad del componente
      const objetivoUi = iconoUi || eid
      ecs.Ui.mutate(world, objetivoUi, (cursor) => {
        cursor.opacity = pausado ? 1 : 0
        return false
      })
    }

    ecs.defineState('reproduciendo')
      .initial()
      .onEnter(() => {
        aplicarEstado(false)
      })
      .onEvent(ecs.input.UI_CLICK, 'pausado')

    ecs.defineState('pausado')
      .onEnter(() => {
        aplicarEstado(true)
      })
      .onEvent(ecs.input.UI_CLICK, 'reproduciendo')
  },
})
